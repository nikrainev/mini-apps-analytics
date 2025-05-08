import { IDialogMessage } from 'schemas/dialogData.scheme';

interface IJSONMessage {
    [key: string]: any,
    date: string,
    from_id: string,
    forwarded_from: string | undefined
}

export const clearTgMessageData = (data: Record<string, any>):{
    messages: IDialogMessage[],
    fromGroup: Record<string, number>,
    name: string
} => {
    const messages = data.messages as IJSONMessage[];

    const fromGroup:Record<string, number> = {};

    return {
        fromGroup,
        name: data.name,
        messages: messages.map((message: IJSONMessage) => {
            if (message.forwarded_from) {
                // eslint-disable-next-line max-len
                fromGroup[message.forwarded_from] = fromGroup[message.forwarded_from] ? fromGroup[message.forwarded_from] + 1 : 1;
            }

            let text = '';

            if (typeof message.text === 'string') {
                text = message.text;
            } else if (message.text_entities) {
                message.text_entities.forEach((entity: { type: string, text:string }) => {
                    text += entity.text;
                });
            }

            return {
                createdAt: message.date,
                from: message.from_id,
                forwardedFrom: message.forwarded_from,
                text,
            };
        }),
    };
};