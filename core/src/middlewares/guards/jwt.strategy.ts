import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { vars } from 'config/vars';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { MyLogger } from 'config/MyLogger';

const headersExtractor = function(req:FastifyRequest) {
    return req.headers?.authorization?.split(' ')?.[1];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(forwardRef(() => MyLogger))
        private readonly logger: MyLogger,
        private readonly jwtService: JwtService
    ) {
        super({
            jwtFromRequest: (req:FastifyRequest) => headersExtractor(req),
            ignoreExpiration: true,
            secretOrKey: vars.jwtSalt,
            passReqToCallback: true,
        });
    }

    async validate(
        request: FastifyRequest,
        payload: any,
    ) {
        let userData = {};
        try {

        } catch (err) {
            this.logger.warn('Jwt strategy auth error');
        }

        return userData;
    }
    
}
