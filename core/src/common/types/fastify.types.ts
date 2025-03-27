import { FastifyRequest } from 'fastify';
import { UserDocument } from '../../schemas/user.scheme';

export interface IRequest extends FastifyRequest {
    user?: UserDocument,
}
