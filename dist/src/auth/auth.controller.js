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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const register_auth_dto_1 = require("./dto/register-auth.dto");
const login_auth_dto_1 = require("./dto/login-auth.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const token_blacklist_service_1 = require("./token-blacklist.service");
const jwt_1 = require("@nestjs/jwt");
let AuthController = class AuthController {
    authService;
    configService;
    tokenBlacklistService;
    jwtService;
    constructor(authService, configService, tokenBlacklistService, jwtService) {
        this.authService = authService;
        this.configService = configService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.jwtService = jwtService;
    }
    register(registerAuthDto) {
        return this.authService.register(registerAuthDto);
    }
    async login(loginAuthDto, req, res) {
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.get('user-agent');
        const result = await this.authService.login(loginAuthDto, ipAddress, userAgent);
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        const sameSiteOption = isProduction ? 'strict' : 'lax';
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: sameSiteOption,
            maxAge: 15 * 60 * 1000,
            path: '/',
        });
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: sameSiteOption,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        return {
            user: result.user,
        };
    }
    async refresh(req, res) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token não fornecido');
        }
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.get('user-agent');
        const result = await this.authService.refreshAccessToken(refreshToken, ipAddress, userAgent);
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        const sameSiteOption = isProduction ? 'strict' : 'lax';
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: sameSiteOption,
            maxAge: 15 * 60 * 1000,
            path: '/',
        });
        return { success: true };
    }
    getProfile(req) {
        const user = req.user;
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }
    async logout(req, res) {
        const token = req.cookies?.access_token || req.headers.authorization?.replace('Bearer ', '');
        const user = req.user;
        if (token) {
            try {
                if (user && user.id) {
                    const ipAddress = req.ip || req.socket.remoteAddress;
                    const userAgent = req.get('user-agent');
                    await this.authService.logout(token, user.id, ipAddress, userAgent);
                }
                else {
                    try {
                        const decoded = this.jwtService.decode(token);
                        if (decoded && decoded.exp) {
                            const expiresAt = new Date(decoded.exp * 1000);
                            await this.tokenBlacklistService.addToBlacklist(token, expiresAt);
                        }
                    }
                    catch (error) {
                    }
                }
            }
            catch (error) {
                console.error('Erro ao fazer logout completo:', error);
            }
        }
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        const sameSiteOption = isProduction ? 'strict' : 'lax';
        res.clearCookie('access_token', {
            path: '/',
            httpOnly: true,
            secure: isProduction,
            sameSite: sameSiteOption,
        });
        res.clearCookie('refresh_token', {
            path: '/',
            httpOnly: true,
            secure: isProduction,
            sameSite: sameSiteOption,
        });
        return { success: true };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar um novo usuário' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuário criado com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'E-mail já existe (Conflict).' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos (Bad Request).' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Muitas requisições. Tente novamente mais tarde.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_auth_dto_1.RegisterAuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        skipMissingProperties: false,
    })),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Realizar login e obter token JWT' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login bem-sucedido, tokens definidos em cookies httpOnly.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciais inválidas.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos.' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Muitas tentativas de login. Tente novamente mais tarde.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_auth_dto_1.LoginAuthDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Renovar access token usando refresh token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token renovado com sucesso.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Refresh token inválido.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter informações do usuário autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Informações do usuário.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Fazer logout e invalidar tokens' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Logout realizado com sucesso.',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('1, Autenticação'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService,
        token_blacklist_service_1.TokenBlacklistService,
        jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map