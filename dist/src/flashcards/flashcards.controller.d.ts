import { FlashcardsService } from './flashcards.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { ReviewFlashcardDto } from './dto/review-flashcard.dto';
import { User } from '@prisma/client';
export declare class FlashcardsController {
    private readonly flashcardsService;
    constructor(flashcardsService: FlashcardsService);
    create(createFlashcardDto: CreateFlashcardDto, user: User): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        topicId: number;
        front: string;
        back: string;
        difficulty: import(".prisma/client").$Enums.FlashcardDifficulty;
        nextReview: Date;
        reviewCount: number;
        lastReviewed: Date | null;
    }>;
    findAll(user: User, topicId?: string, due?: string): Promise<({
        topic: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        topicId: number;
        front: string;
        back: string;
        difficulty: import(".prisma/client").$Enums.FlashcardDifficulty;
        nextReview: Date;
        reviewCount: number;
        lastReviewed: Date | null;
    })[]>;
    findOne(id: number, user: User): Promise<{
        topic: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        topicId: number;
        front: string;
        back: string;
        difficulty: import(".prisma/client").$Enums.FlashcardDifficulty;
        nextReview: Date;
        reviewCount: number;
        lastReviewed: Date | null;
    }>;
    update(id: number, updateFlashcardDto: UpdateFlashcardDto, user: User): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        topicId: number;
        front: string;
        back: string;
        difficulty: import(".prisma/client").$Enums.FlashcardDifficulty;
        nextReview: Date;
        reviewCount: number;
        lastReviewed: Date | null;
    }>;
    review(id: number, reviewFlashcardDto: ReviewFlashcardDto, user: User): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        topicId: number;
        front: string;
        back: string;
        difficulty: import(".prisma/client").$Enums.FlashcardDifficulty;
        nextReview: Date;
        reviewCount: number;
        lastReviewed: Date | null;
    }>;
    remove(id: number, user: User): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        topicId: number;
        front: string;
        back: string;
        difficulty: import(".prisma/client").$Enums.FlashcardDifficulty;
        nextReview: Date;
        reviewCount: number;
        lastReviewed: Date | null;
    }>;
}
