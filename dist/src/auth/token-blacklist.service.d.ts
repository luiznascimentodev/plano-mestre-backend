import { PrismaService } from '../prisma/prisma.service';
export declare class TokenBlacklistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    addToBlacklist(token: string, expiresAt: Date): Promise<void>;
    isBlacklisted(token: string): Promise<boolean>;
    cleanupExpiredTokens(): Promise<void>;
}
