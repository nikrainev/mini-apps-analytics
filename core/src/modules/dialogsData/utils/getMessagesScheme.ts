import { DateString } from '../../../common/types/app.types';

const ZOOMER_CONTEXT_WINDOW_S = 1800;

type Role = 'user' | 'assistant';

export interface Message {
    role: Role;
    content: string;
    createdAt: Date;
}

interface MessageChain {
    startDate?: string;
    messages: Message[];
}

export interface SourceMessage {
    text: string | any;
    createdAt: DateString;
    from: string;
}

let prev_date_time: Date | null = null;

const result_chat: MessageChain[] = [{
    'messages': [],
}];

export const getMessagesScheme = ({ messages, me_id, isJoinGroup = false }:{
    messages: SourceMessage[],
    me_id: string,
    isJoinGroup?: boolean
}):MessageChain[] => {
    for (const r of messages) {
        const text_field = r.text;
        const date_field = r.createdAt;

        if (typeof text_field !== 'string' || text_field === '') {
            continue;
        }

        const datetime_obj = new Date(r.createdAt);

        let role:Role = 'user';
        if (r.from === me_id) {
            role = 'assistant';
        }

        if (prev_date_time) {
            const diff = (datetime_obj.getTime() - prev_date_time.getTime()) / 1000;

            if (diff > ZOOMER_CONTEXT_WINDOW_S) {
                result_chat.push({
                    'startDate': date_field.toString(),
                    'messages': [{
                        'role': role,
                        'content': text_field,
                        'createdAt': datetime_obj,
                    }],
                });
            } else if (result_chat.length > 0) {
                const last_chain = result_chat[result_chat.length - 1];
                const last_message = last_chain.messages[last_chain.messages.length - 1];

                if (isJoinGroup && last_message?.role === role) {
                    const joinedContent = last_message.content + ' ' +text_field;
                    last_chain.messages[last_chain.messages.length - 1] = {
                        ...last_message,
                        content: joinedContent,
                    };
                } else {
                    last_chain.messages.push({
                        'role': role,
                        'content': text_field,
                        'createdAt': datetime_obj,
                    });
                }
            }
        }
        prev_date_time = datetime_obj;
    }

    return result_chat;
};
