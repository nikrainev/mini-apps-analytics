import { FastifyRequest } from 'fastify';

export interface IRequest extends  FastifyRequest {
    user?: Record<string, any>,
}
