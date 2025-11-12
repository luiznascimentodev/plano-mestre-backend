import { PrismaService } from '../prisma/prisma.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { AuditService } from '../audit/audit.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly refreshTokenService;
    private readonly tokenBlacklistService;
    private readonly auditService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, refreshTokenService: RefreshTokenService, tokenBlacklistService: TokenBlacklistService, auditService: AuditService, configService: ConfigService);
    register(dto: RegisterAuthDto): Promise<{
        name: string | null;
        id: number;
        email: string;
        twoFactorSecret: string | null;
        twoFactorEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: LoginAuthDto, ipAddress?: string, userAgent?: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    }>;
    refreshAccessToken(refreshToken: string, ipAddress?: string, userAgent?: string): Promise<{
        access_token: string;
    }>;
    logout(token: string, userId: number, ipAddress?: string, userAgent?: string): Promise<void>;
    validateToken(token: string): Promise<boolean>;
}
