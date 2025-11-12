"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let FlashcardsService = class FlashcardsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const topic = await this.prisma.topic.findUnique({
            where: { id: dto.topicId },
        });
        if (!topic) {
            throw new common_1.NotFoundException('Assunto (Topic) não encontrado.');
        }
        if (topic.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para criar flashcards neste assunto.');
        }
        return this.prisma.flashcard.create({
            data: {
                front: dto.front,
                back: dto.back,
                topicId: dto.topicId,
                userId: userId,
                difficulty: dto.difficulty || client_1.FlashcardDifficulty.MEDIUM,
                nextReview: new Date(),
            },
        });
    }
    async findAll(userId, topicId) {
        const where = { userId };
        if (topicId) {
            const topic = await this.prisma.topic.findUnique({
                where: { id: topicId },
            });
            if (!topic || topic.userId !== userId) {
                throw new common_1.ForbiddenException('Você não tem permissão para acessar este assunto.');
            }
            where.topicId = topicId;
        }
        return this.prisma.flashcard.findMany({
            where,
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                nextReview: 'asc',
            },
        });
    }
    async findDueForReview(userId, topicId) {
        const now = new Date();
        const where = {
            userId,
            nextReview: {
                lte: now,
            },
        };
        if (topicId) {
            const topic = await this.prisma.topic.findUnique({
                where: { id: topicId },
            });
            if (!topic || topic.userId !== userId) {
                throw new common_1.ForbiddenException('Você não tem permissão para acessar este assunto.');
            }
            where.topicId = topicId;
        }
        return this.prisma.flashcard.findMany({
            where,
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                nextReview: 'asc',
            },
        });
    }
    async findOne(id, userId) {
        const flashcard = await this.prisma.flashcard.findUnique({
            where: { id },
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!flashcard) {
            throw new common_1.NotFoundException('Flashcard não encontrado.');
        }
        if (flashcard.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para acessar este flashcard.');
        }
        return flashcard;
    }
    async update(id, dto, userId) {
        const flashcard = await this.findOne(id, userId);
        return this.prisma.flashcard.update({
            where: { id },
            data: {
                ...(dto.front && { front: dto.front }),
                ...(dto.back && { back: dto.back }),
                ...(dto.difficulty && { difficulty: dto.difficulty }),
            },
        });
    }
    async review(id, dto, userId) {
        const flashcard = await this.findOne(id, userId);
        const interval = this.calculateNextReviewInterval(dto.difficulty, flashcard.reviewCount);
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);
        return this.prisma.flashcard.update({
            where: { id },
            data: {
                difficulty: dto.difficulty,
                reviewCount: flashcard.reviewCount + 1,
                lastReviewed: new Date(),
                nextReview: nextReview,
            },
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        return this.prisma.flashcard.delete({
            where: { id },
        });
    }
    calculateNextReviewInterval(difficulty, reviewCount) {
        switch (difficulty) {
            case client_1.FlashcardDifficulty.EASY:
                if (reviewCount === 0)
                    return 1;
                if (reviewCount === 1)
                    return 3;
                if (reviewCount === 2)
                    return 7;
                if (reviewCount === 3)
                    return 14;
                return 30;
            case client_1.FlashcardDifficulty.MEDIUM:
                if (reviewCount === 0)
                    return 1;
                if (reviewCount === 1)
                    return 2;
                if (reviewCount === 2)
                    return 4;
                return 7;
            case client_1.FlashcardDifficulty.HARD:
                return 1;
            default:
                return 1;
        }
    }
};
exports.FlashcardsService = FlashcardsService;
exports.FlashcardsService = FlashcardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FlashcardsService);
//# sourceMappingURL=flashcards.service.js.map