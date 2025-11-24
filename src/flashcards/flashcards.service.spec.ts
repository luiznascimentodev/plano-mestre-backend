import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardsService } from './flashcards.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { FlashcardDifficulty } from '@prisma/client';

describe('FlashcardsService', () => {
  let service: FlashcardsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    flashcard: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    topic: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FlashcardsService>(FlashcardsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      front: 'O que é Constitucional?',
      back: 'É o direito fundamental',
      topicId: 1,
      difficulty: FlashcardDifficulty.MEDIUM,
    };
    const userId = 1;

    it('should create a flashcard successfully', async () => {
      const topic = { id: 1, userId, name: 'Topic' };
      const createdFlashcard = {
        id: 1,
        ...createDto,
        userId,
        reviewCount: 0,
        lastReviewed: null,
        nextReview: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(topic);
      mockPrismaService.flashcard.create.mockResolvedValue(createdFlashcard);

      const result = await service.create(createDto, userId);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: createDto.topicId },
      });
      expect(mockPrismaService.flashcard.create).toHaveBeenCalled();
      expect(result).toEqual(createdFlashcard);
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if topic belongs to another user', async () => {
      const topic = { id: 1, userId: 999, name: 'Topic' };
      mockPrismaService.topic.findUnique.mockResolvedValue(topic);

      await expect(service.create(createDto, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('review', () => {
    const flashcardId = 1;
    const userId = 1;
    const reviewDto = { difficulty: FlashcardDifficulty.EASY };

    it('should update flashcard review successfully', async () => {
      const flashcard = {
        id: flashcardId,
        userId,
        front: 'Question',
        back: 'Answer',
        topicId: 1,
        difficulty: FlashcardDifficulty.MEDIUM,
        reviewCount: 5,
        lastReviewed: new Date(),
        nextReview: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedFlashcard = {
        ...flashcard,
        reviewCount: 6,
        difficulty: reviewDto.difficulty,
        lastReviewed: new Date(),
      };

      mockPrismaService.flashcard.findUnique.mockResolvedValue(flashcard);
      mockPrismaService.flashcard.update.mockResolvedValue(updatedFlashcard);

      const result = await service.review(flashcardId, reviewDto, userId);

      expect(result.reviewCount).toBe(6);
      expect(result.difficulty).toBe(reviewDto.difficulty);
    });

    it('should throw NotFoundException if flashcard does not exist', async () => {
      mockPrismaService.flashcard.findUnique.mockResolvedValue(null);

      await expect(
        service.review(flashcardId, reviewDto, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if flashcard belongs to another user', async () => {
      const flashcard = {
        id: flashcardId,
        userId: 999,
        front: 'Question',
        back: 'Answer',
        topicId: 1,
        difficulty: FlashcardDifficulty.MEDIUM,
        reviewCount: 5,
        lastReviewed: new Date(),
        nextReview: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.flashcard.findUnique.mockResolvedValue(flashcard);

      await expect(
        service.review(flashcardId, reviewDto, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
