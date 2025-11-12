import { FlashcardDifficulty } from '@prisma/client';
export declare class CreateFlashcardDto {
    front: string;
    back: string;
    topicId: number;
    difficulty?: FlashcardDifficulty;
}
