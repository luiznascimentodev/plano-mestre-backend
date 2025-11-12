import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { TokenBlacklistService } from './token-blacklist.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    private readonly tokenBlacklistService;
    private readonly jwtService;
    constructor(authService: AuthService, configService: ConfigService, tokenBlacklistService: TokenBlacklistService, jwtService: JwtService);
    register(registerAuthDto: RegisterAuthDto): Promise<{
        name: string | null;
        id: number;
        email: string;
        twoFactorSecret: string | null;
        twoFactorEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginAuthDto: LoginAuthDto, req: Request, res: Response): Promise<{
        user: {
            id: number;
            email: string;
            name: string | null;
        };
    }>;
    refresh(req: Request, res: Response): Promise<{
        success: boolean;
    }>;
    getProfile(req: Request): {
        id: any;
        email: any;
        name: any;
    };
    logout(req: Request, res: Response): Promise<{
        success: boolean;
    }>;
}
