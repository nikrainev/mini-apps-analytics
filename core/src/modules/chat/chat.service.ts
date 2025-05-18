import { ChatEngine } from './utils/ChatEngine';
import { SendMessageBody } from './requests/sendMessage.request';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'providers/RedisClient';
import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';
import { vars } from '../../config/vars';
import { IResponseWithActions, LangChainChatEngine } from './utils/LangChainChatEngine';
import { FineTunedModels } from './utils/LLMEngine';
import { TelegramAPI } from 'providers/Telegram';
import { MyLogger } from 'config/MyLogger';
import { QdrantProvider } from 'providers/QdrantClient';
import { PERSON_DIALOGS_COLLECTION } from '../../common/const/VECTOR_COLLECTIONS_NAMES';
import { YandexMLProvider } from 'providers/YandexML';
import { InjectModel } from '@nestjs/mongoose';
import { DialogStats, DialogStatsDocument } from 'schemas/dialogStats.scheme';
import mongoose, { Model } from 'mongoose';
import { llmContextToVectorData } from '../dialogsData/utils/llmContextToVectorData';
import { ChatGenerationPromptInputs, MessengerPrompts } from './utils/MessengerPrompt';
import { getObjFromLLM } from './utils/getObjFromLLM';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import TelegramBot = require('node-telegram-bot-api');


@Injectable()
export class ChatService {
    constructor(
        @Inject(RedisClient)
        private readonly redisClient: RedisClient,
        @Inject(forwardRef(() => TelegramAPI))
        private readonly telegram: TelegramAPI,
        @Inject(forwardRef(() => MyLogger))
        private readonly logger: MyLogger,
        @Inject(forwardRef(() => QdrantProvider))
        private readonly qdrantProvider: QdrantProvider,
        @Inject(forwardRef(() => YandexMLProvider))
        private readonly yandexML: YandexMLProvider,
        @InjectModel(DialogStats.name)
        private dialogStatsModel: Model<DialogStatsDocument>,
    ){}
    
    llm:BaseChatModel;
    chatEngine:ChatEngine;
    
    async sendMessage(body:SendMessageBody):Promise<any> {
        const result = await this.onReceiveMessage({
            text: body.text,
            chatId: body.sessionId,
            userId: vars.meUserId,
        });

        return {
            response: result,
        };
    }

    private async getSimilarMessages(dialogPart:string, personId:string):Promise<string[]> {
        const queryVector = await this.yandexML.embeddings.embedQuery(`Собеседник: ${dialogPart}`);

        const result = await this.qdrantProvider.client.query(PERSON_DIALOGS_COLLECTION({
            personId,
        }), {
            query: queryVector,
            params: {
                hnsw_ef: 128,
                exact: false,
            },
            with_payload: true,
            limit: 15,
        });

        return result.points.map((p) => {
            return (p.payload as { text: string }).text;
        });
    }

    async onBotMessageReceived(message:TelegramBot.Message):Promise<void> {
        if (!message.from?.id || !message.text) {
            return;
        }

        this.logger.log('Received text message from bot:', message);

        const responseText = await this.onReceiveMessage({
            text: message.text,
            chatId: message.chat.id.toString(),
            userId: vars.meUserId,
        });

        await this.telegram.client.sendMessage(message.chat.id, responseText);
    }

    private getInitiateMessage = async ({ rag, currentChatHistory }:{ rag: string[], currentChatHistory: string }) => {
        const prompt =  `Перед тобой промпт содержаший историю текущего диалога, два примера с похожими реальными диалогами. Твоя задача придумать инициативное сообщения для LLM которая ведет диалог (в текущем диалоге - Я это ответы LLM). Ответь в формате JSON объекта - { "shouldIntiate": true, "initiateMessage": "" }, shouldInitiate - это поле отвечающие нужно ли LLM инциаровать общение или нет (предлагай инциировать общение когда кажется это уместно в диалоге есть очевидное продлжение или диалог со строны LLM кажется слишком неициативный), initiateMessage - инициативное сообщение от LLM, сообщение будет добавлено в контекcт LLM. 
Напиши в стиле ответов (твои ответы это, то что после Я:) из следующих диалогов:
${rag.join('\n')}

### Промпт с историей диалога для которого ты должен придумать новое инициативное сообщние:
Ты – Никита. Твоя задача – общаться в чате так, как будто это делаешь ты сам(а). Твой стиль общения должен быть максимально близок к тому, как ты обычно общаешься в мессенджерах.
Помимо только ответов на вопросы задавай и свои вместе с ответом на последнее сообщение, но так чтобы это было уместно.
Мне 23 года я мужчина. Живу в Санкт-Петербурге, заканчиваю магистратуру. Люблю шутить (часто иронизирую), часто использую эмодзи. Отвечаю кратко, но по делу. Интересуюсь программированием, AI, велосипедами.

### История текущего диалога (последние сообщения):
${currentChatHistory}
--- КОНЕЦ ИСТОРИИ ТЕКУЩЕГО ДИАЛОГА ---

### Похожие фрагменты из твоих прошлых диалогов (используй их как вдохновение для стиля и содержания, можешь брать отсюда идея для инциативного общения в диалоге, но НЕ КОПИРУЙ дословно):

Пример 1:
${rag[0]}
--- КОНЕЦ ПРИМЕРА 1 ---

Пример 2:
${rag[1]}
--- КОНЕЦ ПРИМЕРА 2 ---`;
    };

    private async getPrompt({ 
        rag1,
        rag2,
        isCorrectionNeeded,
        previousGeneratedResponse,
        verifierLlmFeedback,
        currentChatHistory,
    }:{
        rag1: string,
        rag2: string,
        isCorrectionNeeded: boolean,
        previousGeneratedResponse?: string,
        verifierLlmFeedback?: string,
        currentChatHistory: string,
    }) {
        const messengerPrompts = new MessengerPrompts();

        const initialInputs: ChatGenerationPromptInputs = {
            userNameOrNickname: 'Никита',
            userPersonalityDetails: 'Мне 23 года я мужчина. Живу в Санкт-Петербурге, заканчиваю магистратуру. Люблю шутить (часто иронизирую), часто использую эмодзи. Отвечаю кратко, но по делу. Интересуюсь программированием, AI, велосипедами.',
            ragExample1: rag1,
            ragExample2: rag2,
            isCorrectionNeeded: false,
            currentChatHistory,
        };

        if (isCorrectionNeeded) {
            initialInputs.isCorrectionNeeded = true;
            initialInputs.previousGeneratedResponse = previousGeneratedResponse;
            initialInputs.verifierLlmFeedback = verifierLlmFeedback;
        }

        return messengerPrompts.formatChatPrompt(initialInputs);
    };

    private async evaluateLLMAnswer({ currentDialog }:{ currentDialog: string }):Promise<{
        shouldRetry: boolean,
        retryDesc: string,
    }> {
        const model = new ChatOpenAI({
            model: 'deepseek-ai/DeepSeek-V3',
            configuration: {
                baseURL: vars.nebius.baseUrl,
                apiKey: vars.nebius.secretKey,
            },
            temperature: 0.1,
        });

        const prompt = 'У тебя есть часть перепески, где последнее сообщение было сгенерировано LLM,' +
            ' тебе нужно оценить логичность последнего сообщения. Сообщение является нелогичным, ' +
            'если не возможно понять его связь с остальной перепиской. Ответы могут быть оскорбительными или ироничными.' +
            ' Отвечай в формате JSON объекта:' +
            ' { "shouldRetry": boolean, "retryDesc": string }. shouldRetry - нужно перегенерировать ответ, retryDesc -' +
            ' подсказка для LLM почему ответ не верный. Возвращай только объект вида { "shouldRetry": boolean, "retryDesc": string }' +

            'Пример 1: \n' +
            'Собеседник: Нет'+
            'Я: ты где  \n' +
            'Собеседник: Иду  \n' +
            'Я: куда....  \n' +
            'Собеседник: Домой' +
            'Я: ничево не забыл ? 😥' +
            'Собеседник: С днем рождения Вспомнил... Но у меня башка ща лопнет... От информации\\n\' +\n' +
            'Я: Ладно Сиди осмысляй Услышанное  \n' +
            'Ответ 1 { "shouldRetry": false, "retryDesc": "" }  \n' +

            'Пример 2: \n' +
            'Я: Что в субботу делаешь? \n ' +
            'Собеседник: В школу  \n' +
            'Я: до скольки?  \n' +
            'Собеседник: До 2.30  \n' +
            'Я: давай в сестрорецк после  \n' +
            'Я: Можно  \n' +
            'Собеседник:все, тогда где встречаемся?  \n' +
            'Я: В школе  \n' +
            'Собеседник:...  \n' +
            'Я: там пойдём в кино  \n' +
            'Ответ 2: { "shouldRetry": true, "retryDesc": "Пойдем в кино не связано с контекстом диалога (оно ломает его смысла), шуткой или иронией это нельзя назвать" } \n' +
            'Теперь оцени этот диалог: \n' + currentDialog;

        const aiMsg = await model.invoke(prompt);
        const result = getObjFromLLM({
            llmResult: aiMsg.content as string,
        });

        if (result.isValid) {
            return {
                shouldRetry: result.obj.shouldRetry || false,
                retryDesc: result.obj.retryDesc || '',
            };
        }
        return {
            shouldRetry: false,
            retryDesc: '',
        };
    }

    private async tryGetAnswerFromLLM({ chatId, prompt, humanMessage }:{ chatId: string, prompt: string, humanMessage: string }):Promise<IResponseWithActions> {
        this.llm = new ChatOpenAI({
            configuration: {
                baseURL: vars.nebius.baseUrl,
                apiKey: vars.nebius.secretKey,
            },
            model: FineTunedModels.Llama70bAllMy,
            temperature: 0.8,
            topP: 0.9,
        });

        const chain = new LangChainChatEngine({
            llm: this.llm,
            sessionId: chatId,
        });

        return await chain.invoke({ prompt, humanMessage });
    }

    private async getAnswerFromLLm({
        retryLimit,
        currentRetry,
        chatId,
        rag,
        isCorrectionNeeded,
        humanMessage,
        previousGeneratedResponse,
        verifierLlmFeedback,
        lastDialogHistoryInText,
        currentChatHistory,
    }:{
        retryLimit: number,
        currentRetry: number,
        chatId: string,
        rag: string[],
        lastDialogHistoryInText: string,
        humanMessage: string,
        currentChatHistory: string,
        isCorrectionNeeded?: boolean,
        previousGeneratedResponse?: string,
        verifierLlmFeedback?: string,
    }):Promise<string> {
        try {
            const prompt = await this.getPrompt({
                rag1: rag[0],
                rag2: rag[1],
                isCorrectionNeeded: isCorrectionNeeded || false,
                previousGeneratedResponse,
                verifierLlmFeedback,
                currentChatHistory,
            });

            const llmAnswer = await this.tryGetAnswerFromLLM({
                chatId,
                prompt,
                humanMessage,
            });

            this.logger.log('get llm call');

            const resultAnswer = await this.evaluateLLMAnswer({
                currentDialog: lastDialogHistoryInText + ` \n Я: ${llmAnswer.response}`,
            });

            await this.getInitiateMessage({
                rag,
                currentChatHistory,
            });

            if (resultAnswer.shouldRetry && (retryLimit > currentRetry)) {
                this.logger.log(`retry ${currentRetry}, answer: ${llmAnswer.response}, feedback ${resultAnswer.retryDesc}`);
                return this.getAnswerFromLLm({
                    retryLimit,
                    currentRetry: currentRetry + 1,
                    chatId,
                    rag,
                    isCorrectionNeeded: true,
                    previousGeneratedResponse: llmAnswer.response,
                    verifierLlmFeedback: resultAnswer.retryDesc,
                    lastDialogHistoryInText,
                    humanMessage,
                    currentChatHistory,
                });
            }

            await llmAnswer.onSaveContext();

            return llmAnswer.response;
        } catch (e) {
            this.logger.error('error get Answer from llm', e);
            if (retryLimit > currentRetry) {
                return this.getAnswerFromLLm({
                    retryLimit,
                    currentRetry: currentRetry + 1,
                    chatId,
                    rag,
                    isCorrectionNeeded,
                    previousGeneratedResponse,
                    verifierLlmFeedback,
                    lastDialogHistoryInText,
                    humanMessage,
                    currentChatHistory,
                });
            }

            return '';
        }
    };

    private async onReceiveMessage({ text, chatId, userId }:{ text: string, chatId: string, userId: string }):Promise<string> {
        this.logger.log('before get dialogStats');
        const selectedDialogStats = await this.dialogStatsModel.findOne({
            ownerUserId: new mongoose.Types.ObjectId(userId),
            isSelected: true,
        });

        this.logger.log('get dialogStats');

        if (!selectedDialogStats) {
            return '';
        }

        const dialogHistory = await this.redisClient.client.lrange(chatId, 0, -1);
        this.logger.log('get redis');
        const parsedDialogHistory = dialogHistory.map((d) => JSON.parse(d));
        let lastDialogHistoryInText = llmContextToVectorData(parsedDialogHistory.slice(0, 30).reverse());
        lastDialogHistoryInText = `${lastDialogHistoryInText}\n Собеседник:${text} \n`;

        const similarMessages = await this.getSimilarMessages(lastDialogHistoryInText, selectedDialogStats.personId);

        this.logger.log('get vector');

        return this.getAnswerFromLLm({
            retryLimit: 10,
            currentRetry: 1,
            chatId,
            rag: similarMessages,
            isCorrectionNeeded: false,
            lastDialogHistoryInText,
            humanMessage: text,
            currentChatHistory: lastDialogHistoryInText,
        });
    }
}