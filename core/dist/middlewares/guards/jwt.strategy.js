"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const vars_1 = require("../../config/vars");
const jwt_1 = require("@nestjs/jwt");
const MyLogger_1 = require("../../config/MyLogger");
const headersExtractor = function (req) {
    return req.headers?.authorization?.split(' ')?.[1] || null;
};
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(logger, jwtService) {
        super({
            jwtFromRequest: (req) => headersExtractor(req),
            ignoreExpiration: true,
            secretOrKey: vars_1.vars.jwtSalt,
            passReqToCallback: true,
        });
        this.logger = logger;
        this.jwtService = jwtService;
    }
    async validate(request, payload) {
        let userData = {};
        try {
        }
        catch (err) {
            this.logger.warn('Jwt strategy auth error');
        }
        return userData;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => MyLogger_1.MyLogger))),
    __metadata("design:paramtypes", [MyLogger_1.MyLogger,
        jwt_1.JwtService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map