import { PrismaService } from '../prisma/prisma.service';
export declare class RefreshTokenService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateRefreshToken(userId: number): Promise<string>;
    validateRefreshToken(token: string): Promise<number>;
    revokeRefreshToken(token: string): Promise<void>;
    revokeAllUserTokens(userId: number): Promise<void>;
    cleanupExpiredTokens(): Promise<void>;
}
