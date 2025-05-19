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
import OpenAI from 'openai';
import { probabilityCheck } from './utils/propablityCheck';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { splitTextIntoParts } from './utils/splitTextIntoPairs';
import { getSendDelay } from './utils/getSendDelay';


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
        @InjectQueue('sendMessage') private sendMessageQueue: Queue
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

        const splitStr = splitTextIntoParts(responseText, 100, 40);
        const sendDelay = getSendDelay({
            messages: splitStr,
        });

        const jobPromises = sendDelay.map((d) => this.sendMessageQueue.add('messagechunk', {
            text: d.str,
            chatId: message.chat.id,
        }, {
            delay: d.delayMs,
        }));

        await Promise.all(jobPromises);
    }

    private getInitiateMessage = async ({ rag, currentChatHistory }:{ rag: string[], currentChatHistory: string }):Promise<{
        shouldInitiate: boolean,
        message: string,
    }> => {
        const prompt =  `Перед тобой промпт содержаший историю текущего диалога, два примера с похожими реальными диалогами. Твоя задача придумать инициативное сообщения для LLM которая ведет диалог (в текущем диалоге - Я это ответы LLM). Ответь в формате JSON объекта - { "shouldInitiate": true, "initiateMessage": "" }, shouldInitiate - это поле отвечающие нужно ли LLM инциаровать общение или нет (предлагай инциировать общение когда кажется это уместно в диалоге есть очевидное продлжение или диалог со строны LLM кажется слишком неициативный), initiateMessage - инициативное сообщение от LLM, сообщение будет добавлено в контекcт LLM, не будь навящим не повторяй вопросы по многу раз, если человек на них не отвечает. Кроме вопросов еще можешь придумать сообщения просто о новой теме (близкой диалогу) 
Напиши в стиле ответов (твои ответы это, то что после Я:) из следующих диалогов: 
${rag.join('\n')}

### Промпт с историей диалога для которого ты должен придумать новое инициативное сообщние:
Ты – Никита. Твоя задача – общаться в чате так, как будто это делаешь ты сам(а). Твой стиль общения должен быть максимально близок к тому, как ты обычно общаешься в мессенджерах.
Помимо только ответов на вопросы задавай и свои вместе с ответом на последнее сообщение, но так чтобы это было уместно.
Мне 23 года я мужчина. Живу в Санкт-Петербурге, заканчиваю магистратуру. Люблю шутить (часто иронизирую). Отвечаю кратко, но по делу. Интересуюсь программированием, AI, велосипедами.

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

        const client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: vars.openRouter.key,
        });

        const completion = await client.chat.completions.create({
            model: 'x-ai/grok-3-beta',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        const result = getObjFromLLM({
            llmResult: completion.choices[0].message.content as string,
        });

        return {
            shouldInitiate: result.obj.shouldInitiate || false,
            message: result.obj.initiateMessage || '',
        };
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
        shouldInitiate: boolean,
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
            ' Так-же оцени не является ли диалог со стороны LLM слишком пассивным (не похож ли он на интервью где пользователь просто задает вопросы)' +
            ' Отвечай в формате JSON объекта:' +
            ' { "shouldRetry": boolean, "shouldInitiate": boolean, "retryDesc": string }. shouldRetry - нужно перегенерировать ответ, shouldInitiate - нужна инициатива от LLM, retryDesc -' +
            ' подсказка для LLM почему ответ не верный. Возвращай только объект вида { "shouldRetry": boolean, "shouldInitiate": boolean, "retryDesc": string }, Оценивай только ответы LLM (то есть Я:), не оценивай ответы собеседника, (Собеседник:) даже последнии' +

            'Пример 1: \n' +
            'Собеседник: Нет'+
            'Я: ты где  \n' +
            'Собеседник: Иду  \n' +
            'Я: куда....  \n' +
            'Собеседник: Домой' +
            'Я: ничево не забыл ? 😥' +
            'Собеседник: С днем рождения Вспомнил... Но у меня башка ща лопнет... От информации\\n\' +\n' +
            'Я: Ладно Сиди осмысляй Услышанное  \n' +
            'Ответ 1 { "shouldRetry": false, "shouldInitiate": false, "retryDesc": "" }  \n' +

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
            'Ответ 2: { "shouldRetry": true, "shouldInitiate": true, "retryDesc": "Пойдем в кино не связано с контекстом диалога (оно ломает его смысла), шуткой или иронией это нельзя назвать" } \n' +
            'Теперь оцени этот диалог: \n' + currentDialog;

        const aiMsg = await model.invoke(prompt);
        const result = getObjFromLLM({
            llmResult: aiMsg.content as string,
        });

        if (result.isValid) {
            return {
                shouldRetry: result.obj.shouldRetry || false,
                shouldInitiate: result.obj.shouldInitiate || false,
                retryDesc: result.obj.retryDesc || '',
            };
        }
        return {
            shouldRetry: false,
            shouldInitiate: false,
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
            topP: 0.6,
        });
        /*
            Good For Bashir:
            temperature: 0.8,
            topP: 0.9,

            Good for MyAll
            temperature: 0.8,
            topP: 0.6,
         */

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
        currentChatHistory,
    }:{
        retryLimit: number,
        currentRetry: number,
        chatId: string,
        rag: string[],
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

            const resultAnswer = await this.evaluateLLMAnswer({
                currentDialog: currentChatHistory + ` \n Я: ${llmAnswer.response}`,
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
                    humanMessage,
                    currentChatHistory,
                });
            }

            let saveInitiate = '';

            if (resultAnswer.shouldInitiate && probabilityCheck(0.3)) {
                const result = await this.getInitiateMessage({
                    rag,
                    currentChatHistory: currentChatHistory + ` \n Я: ${llmAnswer.response}`,
                });

                if (result.shouldInitiate) {
                    saveInitiate = result.message;
                    llmAnswer.response = llmAnswer.response + ' ' + result.message;
                }
            }

            await llmAnswer.onSaveContext();

            if (saveInitiate) {
                await llmAnswer.onAppendNewMessage(saveInitiate);
            }

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
                    humanMessage,
                    currentChatHistory,
                });
            }

            return '';
        }
    };

    private async onReceiveMessage({ text, chatId, userId }:{ text: string, chatId: string, userId: string }):Promise<string> {
        const selectedDialogStats = await this.dialogStatsModel.findOne({
            ownerUserId: new mongoose.Types.ObjectId(userId),
            isSelected: true,
        });

        if (!selectedDialogStats) {
            return '';
        }

        const dialogHistory = await this.redisClient.client.lrange(chatId, 0, -1);
        const parsedDialogHistory = dialogHistory.map((d) => JSON.parse(d));
        let lastDialogHistoryInText = llmContextToVectorData(parsedDialogHistory.slice(0, 100).reverse());
        lastDialogHistoryInText = `${lastDialogHistoryInText}\n Собеседник:${text} \n`;

        const similarMessages = await this.getSimilarMessages(lastDialogHistoryInText, selectedDialogStats.personId);

        return this.getAnswerFromLLm({
            retryLimit: 10,
            currentRetry: 1,
            chatId,
            rag: similarMessages,
            isCorrectionNeeded: false,
            humanMessage: text,
            currentChatHistory: lastDialogHistoryInText,
        });
    }
}