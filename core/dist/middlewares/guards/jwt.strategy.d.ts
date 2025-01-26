import { Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { MyLogger } from 'config/MyLogger';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly logger;
    private readonly jwtService;
    constructor(logger: MyLogger, jwtService: JwtService);
    validate(request: FastifyRequest, payload: any): Promise<{}>;
}
export {};
