import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SendMessageBody {
    @IsString()
    @Type(() => String)
    text: string;

    @IsString()
    @Type(() => String)
    sessionId: string;
}

export interface SendMessageRes {
    response: string,
}
