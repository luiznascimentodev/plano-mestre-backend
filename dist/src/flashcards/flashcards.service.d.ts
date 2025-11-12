import { PrismaService } from '../prisma/prisma.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { ReviewFlashcardDto } from './dto/review-flashcard.dto';
export declare class FlashcardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFlashcardDto, userId: number): Promise<{
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
    findAll(userId: number, topicId?: number): Promise<({
        topic: {
            name: string;
            id: number;
            status: import(".prisma/client").$Enums.StudyStatus;
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
    findDueForReview(userId: number, topicId?: number): Promise<({
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
    findOne(id: number, userId: number): Promise<{
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
    update(id: number, dto: UpdateFlashcardDto, userId: number): Promise<{
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
    review(id: number, dto: ReviewFlashcardDto, userId: number): Promise<{
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
    remove(id: number, userId: number): Promise<{
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
    private calculateNextReviewInterval;
}
