import { AppService } from './app.service';
import type { User } from '@prisma/client';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getProfile(user: User): {
        name: string | null;
        id: number;
        email: string;
        twoFactorSecret: string | null;
        twoFactorEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}
