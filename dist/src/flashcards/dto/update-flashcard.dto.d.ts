import { FlashcardDifficulty } from '@prisma/client';
export declare class UpdateFlashcardDto {
    front?: string;
    back?: string;
    difficulty?: FlashcardDifficulty;
}
