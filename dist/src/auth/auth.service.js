"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const refresh_token_service_1 = require("./refresh-token.service");
const token_blacklist_service_1 = require("./token-blacklist.service");
const audit_service_1 = require("../audit/audit.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    prisma;
    jwtService;
    refreshTokenService;
    tokenBlacklistService;
    auditService;
    configService;
    constructor(prisma, jwtService, refreshTokenService, tokenBlacklistService, auditService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.auditService = auditService;
        this.configService = configService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Este e-mail já está em uso.');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashedPassword,
            },
        });
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    async login(dto, ipAddress, userAgent) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            await this.auditService.log({
                action: 'LOGIN_ATTEMPT',
                success: false,
                errorMessage: 'Usuário não encontrado',
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Credenciais inválidas.');
        }
        if (!user.password) {
            await this.auditService.log({
                action: 'LOGIN_ATTEMPT',
                success: false,
                errorMessage: 'Usuário sem senha',
                userId: user.id,
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Credenciais inválidas.');
        }
        try {
            const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
            if (!isPasswordMatch) {
                await this.auditService.log({
                    action: 'LOGIN_ATTEMPT',
                    success: false,
                    errorMessage: 'Senha incorreta',
                    userId: user.id,
                    ipAddress,
                    userAgent,
                });
                throw new common_1.UnauthorizedException('Credenciais inválidas.');
            }
        }
        catch (error) {
            await this.auditService.log({
                action: 'LOGIN_ATTEMPT',
                success: false,
                errorMessage: 'Erro na comparação de senha',
                userId: user.id,
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Credenciais inválidas.');
        }
        const payload = { email: user.email, sub: user.id, name: user.name };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = await this.refreshTokenService.generateRefreshToken(user.id);
        await this.auditService.log({
            action: 'LOGIN_SUCCESS',
            success: true,
            userId: user.id,
            ipAddress,
            userAgent,
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
    async refreshAccessToken(refreshToken, ipAddress, userAgent) {
        try {
            const userId = await this.refreshTokenService.validateRefreshToken(refreshToken);
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Usuário não encontrado');
            }
            const payload = { email: user.email, sub: user.id, name: user.name };
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: '15m',
            });
            await this.auditService.log({
                action: 'TOKEN_REFRESHED',
                success: true,
                userId: user.id,
                ipAddress,
                userAgent,
            });
            return {
                access_token: accessToken,
            };
        }
        catch (error) {
            await this.auditService.log({
                action: 'TOKEN_REFRESH_FAILED',
                success: false,
                errorMessage: error.message,
                ipAddress,
                userAgent,
            });
            throw new common_1.UnauthorizedException('Refresh token inválido');
        }
    }
    async logout(token, userId, ipAddress, userAgent) {
        try {
            const decoded = this.jwtService.decode(token);
            if (decoded && decoded.exp) {
                const expiresAt = new Date(decoded.exp * 1000);
                await this.tokenBlacklistService.addToBlacklist(token, expiresAt);
            }
        }
        catch (error) {
        }
        await this.refreshTokenService.revokeAllUserTokens(userId);
        await this.auditService.log({
            action: 'LOGOUT',
            success: true,
            userId,
            ipAddress,
            userAgent,
        });
    }
    async validateToken(token) {
        if (await this.tokenBlacklistService.isBlacklisted(token)) {
            return false;
        }
        try {
            this.jwtService.verify(token);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        refresh_token_service_1.RefreshTokenService,
        token_blacklist_service_1.TokenBlacklistService,
        audit_service_1.AuditService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map