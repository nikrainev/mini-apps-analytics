import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { vars } from 'config/vars';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { MyLogger } from 'config/MyLogger';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.scheme';
import { Model } from 'mongoose';

const headersExtractor = function(req:FastifyRequest) {
    return req.cookies.authToken || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(forwardRef(() => MyLogger))
        private readonly logger: MyLogger,
        private readonly jwtService: JwtService,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
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

        return await this.userModel.findOne({
            _id: payload.userId,
        }).exec();
    }
    
}
