import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { User } from '@prisma/client';
export declare class SuggestionsController {
    private readonly suggestionsService;
    constructor(suggestionsService: SuggestionsService);
    create(user: User, dto: CreateSuggestionDto): Promise<{
        success: boolean;
        message: string;
        warning?: undefined;
    } | {
        success: boolean;
        message: string;
        warning: string;
    }>;
}
