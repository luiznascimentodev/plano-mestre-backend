import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TokenBlacklistService } from './token-blacklist.service';
import type { User } from '@prisma/client';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    private readonly configService;
    private readonly tokenBlacklistService;
    constructor(prisma: PrismaService, configService: ConfigService, tokenBlacklistService: TokenBlacklistService);
    validate(payload: {
        sub: number;
        email: string;
        iat?: number;
        exp?: number;
    }): Promise<User>;
}
export {};
