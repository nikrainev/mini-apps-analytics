import { Message } from './getMessagesScheme';

export const chainToVectorData = (message:Message):string => {
    return (message.role === 'user' ? 'Собеседник: ' : 'Я: ') + message.content;
};