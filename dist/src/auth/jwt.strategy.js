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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const token_blacklist_service_1 = require("./token-blacklist.service");
const extractTokenFromRequest = (req) => {
    if (req.cookies && req.cookies.access_token) {
        return req.cookies.access_token;
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
};
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prisma;
    configService;
    tokenBlacklistService;
    constructor(prisma, configService, tokenBlacklistService) {
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET não está configurado. Configure a variável de ambiente JWT_SECRET.');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                extractTokenFromRequest,
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        this.prisma = prisma;
        this.configService = configService;
        this.tokenBlacklistService = tokenBlacklistService;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não encontrado ou token inválido.');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        token_blacklist_service_1.TokenBlacklistService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map