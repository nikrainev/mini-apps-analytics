import {
    PromptTemplate,
} from '@langchain/core/prompts';

export interface ChatGenerationPromptInputs {
    userNameOrNickname: string;
    userPersonalityDetails: string;
    currentChatHistory: string;
    ragExample1: string;
    ragExample2: string;
    // Опциональные поля для ветки коррекции
    isCorrectionNeeded?: boolean; // Ключ для {{#if}}
    previousGeneratedResponse?: string;
    verifierLlmFeedback?: string;
}

export class MessengerPrompts {
    /**
     * Пример того, как можно было бы динамически строить строку шаблона,
     * если стандартный PromptTemplate не обрабатывает {{#if}}.
     * Этот подход более надежен для стандартного использования Langchain.
     */
    public getChatGenerationPromptDynamically(isCorrection: boolean): PromptTemplate<ChatGenerationPromptInputs> {
        const baseTemplateParts = [
            `Ты – {userNameOrNickname}. Твоя задача – общаться в чате так, как будто это делаешь ты сам(а). Твой стиль общения должен быть максимально близок к тому, как ты обычно общаешься в мессенджерах.
Помимо только ответов на вопросы задавай и свои вместе с ответом на последнее сообщение, но так чтобы это было уместно.
### О тебе (ключевые детали твоей личности, которые помогут генерировать более точные ответы):
{userPersonalityDetails}

### История текущего диалога (последние сообщения):
{currentChatHistory}
--- КОНЕЦ ИСТОРИИ ТЕКУЩЕГО ДИАЛОГА ---

### Похожие фрагменты из твоих прошлых диалогов (используй их как вдохновение для стиля и содержания, можешь брать отсюда идея для инциативного общения в диалоге, но НЕ КОПИРУЙ дословно):

Пример 1:
{ragExample1}
--- КОНЕЦ ПРИМЕРА 1 ---

Пример 2:
{ragExample2}
--- КОНЕЦ ПРИМЕРА 2 ---`,
        ];

        let taskSpecificSection: string;
        const inputVariables: (keyof ChatGenerationPromptInputs)[] = [
            'userNameOrNickname',
            'userPersonalityDetails',
            'currentChatHistory',
            'ragExample1',
            'ragExample2',
        ];

        if (isCorrection) {
            taskSpecificSection = `
### Предыдущий предложенный тобой ответ (который нужно исправить):
{previousGeneratedResponse}

### Замечания от верифицирующей LLM (почему предыдущий ответ был некорректным или что нужно улучшить):
{verifierLlmFeedback}

### Твоя новая задача:
Учитывая замечания выше, перепиши свой ответ на ПОСЛЕДНЕЕ сообщение в "Истории текущего диалога".
Сделай его более точным, уместным, и соответствующим твоему стилю общения, как описано в секции "О тебе" и показано в примерах.
Постарайся интегрировать суть замечаний так, чтобы ответ стал лучше.
Пиши только сам ИСПРАВЛЕННЫЙ ответ, без каких-либо предисловий или мета-комментариев.`;
            inputVariables.push('previousGeneratedResponse', 'verifierLlmFeedback');
        } else {
            taskSpecificSection = `
### Твоя задача:
Напиши ответ на ПОСЛЕДНЕЕ сообщение в "Истории текущего диалога".
Твой ответ должен быть естественным, аутентичным и отражать твой стиль общения, описанный в секции "О тебе" и показанный в примерах.
Пожалуйста, не копируй примеры дословно, а используй их как вдохновение для тона, стиля и возможных тем для ответа.
Отвечай только ОДНИМ сообщением. Пиши только сам ответ, без каких-либо предисловий или мета-комментариев.`;
        }

        const finalTemplateString = [
            ...baseTemplateParts,
            taskSpecificSection,
            '\nТвой ответ:',
        ].join('\n');

        return new PromptTemplate<ChatGenerationPromptInputs>({
            template: finalTemplateString,
            inputVariables: inputVariables,
        });
    }

    public async formatChatPrompt(inputs: ChatGenerationPromptInputs): Promise<string> {
        // Вариант 1: Используем getChatGenerationPrompt и надеемся, что {{#if}} обработается
        // const promptTemplate = this.getChatGenerationPrompt();
        // return await promptTemplate.format(inputs);

        // Вариант 2: Используем динамическое построение шаблона (более надежный)
        const isCorrectionMode = inputs.isCorrectionNeeded === true;
        const promptTemplate = this.getChatGenerationPromptDynamically(isCorrectionMode);

        // Удаляем необязательные ключи из inputs, если они не нужны для этого режима,
        // чтобы не было ошибок форматирования "Missing value for input variable"
        const relevantInputs: Partial<ChatGenerationPromptInputs> = { ...inputs };
        if (!isCorrectionMode) {
            delete relevantInputs.previousGeneratedResponse;
            delete relevantInputs.verifierLlmFeedback;
        }

        return await promptTemplate.format(relevantInputs as any);
    }
}