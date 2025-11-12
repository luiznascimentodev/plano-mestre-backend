import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
export declare class SuggestionsService {
    private readonly prisma;
    private readonly configService;
    private transporter;
    constructor(prisma: PrismaService, configService: ConfigService);
    create(userId: number, dto: CreateSuggestionDto): Promise<{
        success: boolean;
        message: string;
        warning?: undefined;
    } | {
        success: boolean;
        message: string;
        warning: string;
    }>;
}
