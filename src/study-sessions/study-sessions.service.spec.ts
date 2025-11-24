import { Test, TestingModule } from '@nestjs/testing';
import { StudySessionsService } from './study-sessions.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('StudySessionsService', () => {
  let service: StudySessionsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    studySession: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    topic: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudySessionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StudySessionsService>(StudySessionsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      duration: 3600, // 1 hora em segundos
      topicId: 1,
    };
    const userId = 1;

    it('should create a study session successfully', async () => {
      const topic = {
        id: 1,
        userId,
        name: 'Topic',
        status: 'NOT_STARTED' as any,
        notes: null,
        category: null,
        priority: null,
        dueDate: null,
        description: null,
        tags: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdSession = {
        id: 1,
        ...createDto,
        userId,
        completedAt: new Date(),
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(topic);
      mockPrismaService.$transaction = jest
        .fn()
        .mockImplementation(async (callback) => {
          return callback({
            studySession: mockPrismaService.studySession,
            topic: mockPrismaService.topic,
          });
        });
      mockPrismaService.studySession.create.mockResolvedValue(createdSession);

      const result = await service.create(createDto, userId);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: createDto.topicId },
      });
      expect(result).toEqual(createdSession);
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if topic belongs to another user', async () => {
      const topic = {
        id: 1,
        userId: 999,
        name: 'Topic',
        status: 'NOT_STARTED' as any,
        notes: null,
        category: null,
        priority: null,
        dueDate: null,
        description: null,
        tags: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(topic);

      await expect(service.create(createDto, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAll', () => {
    const userId = 1;

    it('should return all study sessions for a user', async () => {
      const sessions = [
        {
          id: 1,
          duration: 3600,
          topicId: 1,
          userId,
          completedAt: new Date(),
        },
        {
          id: 2,
          duration: 1800,
          topicId: 2,
          userId,
          completedAt: new Date(),
        },
      ];

      mockPrismaService.studySession.findMany.mockResolvedValue(sessions);

      const result = await service.findAll(userId);

      expect(mockPrismaService.studySession.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
        }),
      );
      expect(result).toEqual(sessions);
      expect(result).toHaveLength(2);
    });
  });
});
