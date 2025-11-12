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
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TokenBlacklistService = class TokenBlacklistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addToBlacklist(token, expiresAt) {
        try {
            await this.prisma.tokenBlacklist.upsert({
                where: { token },
                update: { expiresAt },
                create: {
                    token,
                    expiresAt,
                },
            });
        }
        catch (error) {
        }
    }
    async isBlacklisted(token) {
        const blacklisted = await this.prisma.tokenBlacklist.findUnique({
            where: { token },
        });
        if (!blacklisted) {
            return false;
        }
        if (blacklisted.expiresAt < new Date()) {
            await this.prisma.tokenBlacklist.delete({
                where: { token },
            });
            return false;
        }
        return true;
    }
    async cleanupExpiredTokens() {
        await this.prisma.tokenBlacklist.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map