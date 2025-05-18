interface RedisMessagePart {
    type: 'ai' | 'human',
    data: {
        content: string,
    }
}

export const llmContextToVectorData = (messages:RedisMessagePart[]):string => {
    return messages.map((m) => {
        const role = m.type === 'ai' ? 'Я' : 'Собеседник';
        return `${role}: ${m.data.content}`;
    }).join('\n');
};