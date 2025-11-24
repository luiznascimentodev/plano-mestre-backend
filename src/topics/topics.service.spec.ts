import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TopicPriority } from '@prisma/client';

describe('TopicsService', () => {
  let service: TopicsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    topic: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTopicDto = {
      name: 'Direito Constitucional',
      category: 'Direito',
      priority: TopicPriority.HIGH,
      description: 'Estudo de constitucional',
      tags: 'direito,constitucional',
      color: '#3B82F6',
    };
    const userId = 1;

    it('should create a topic successfully', async () => {
      const createdTopic = {
        id: 1,
        ...createTopicDto,
        userId,
        status: 'NOT_STARTED' as any,
        notes: null,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.topic.create.mockResolvedValue(createdTopic);

      const result = await service.create(createTopicDto, userId);

      expect(mockPrismaService.topic.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: createTopicDto.name,
          userId,
          category: createTopicDto.category,
        }),
      });
      expect(result).toEqual(createdTopic);
    });
  });

  describe('findAll', () => {
    const userId = 1;

    it('should return all topics for a user', async () => {
      const topics = [
        {
          id: 1,
          name: 'Topic 1',
          userId,
          status: 'NOT_STARTED' as any,
          notes: null,
          category: 'Test',
          priority: TopicPriority.HIGH,
          dueDate: null,
          description: null,
          tags: null,
          color: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Topic 2',
          userId,
          status: 'IN_PROGRESS' as any,
          notes: null,
          category: 'Test',
          priority: TopicPriority.MEDIUM,
          dueDate: null,
          description: null,
          tags: null,
          color: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.topic.findMany.mockResolvedValue(topics);

      const result = await service.findAll(userId);

      expect(mockPrismaService.topic.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { status: 'asc' },
      });
      expect(result).toEqual(topics);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if user has no topics', async () => {
      mockPrismaService.topic.findMany.mockResolvedValue([]);

      const result = await service.findAll(userId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    const topicId = 1;
    const userId = 1;

    it('should return a topic if it belongs to the user', async () => {
      const topic = {
        id: topicId,
        name: 'Topic 1',
        userId,
        status: 'NOT_STARTED' as any,
        notes: null,
        category: 'Test',
        priority: TopicPriority.HIGH,
        dueDate: null,
        description: null,
        tags: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(topic);

      const result = await service.findOne(topicId, userId);

      expect(mockPrismaService.topic.findUnique).toHaveBeenCalledWith({
        where: { id: topicId },
      });
      expect(result).toEqual(topic);
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(service.findOne(topicId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if topic belongs to another user', async () => {
      const topic = {
        id: topicId,
        name: 'Topic 1',
        userId: 999, // Different user
        status: 'NOT_STARTED' as any,
        notes: null,
        category: 'Test',
        priority: TopicPriority.HIGH,
        dueDate: null,
        description: null,
        tags: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(topic);

      await expect(service.findOne(topicId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    const topicId = 1;
    const userId = 1;
    const updateDto = {
      name: 'Updated Topic',
      notes: 'New notes',
    };

    it('should update a topic successfully', async () => {
      const existingTopic = {
        id: topicId,
        name: 'Original Topic',
        userId,
        status: 'NOT_STARTED' as any,
        notes: null,
        category: 'Test',
        priority: TopicPriority.HIGH,
        dueDate: null,
        description: null,
        tags: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTopic = {
        ...existingTopic,
        ...updateDto,
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(existingTopic);
      mockPrismaService.topic.update.mockResolvedValue(updatedTopic);

      const result = await service.update(topicId, updateDto, userId);

      expect(mockPrismaService.topic.update).toHaveBeenCalledWith({
        where: { id: topicId },
        data: expect.objectContaining(updateDto),
      });
      expect(result.name).toBe(updateDto.name);
      expect(result.notes).toBe(updateDto.notes);
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(service.update(topicId, updateDto, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.topic.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if trying to update another users topic', async () => {
      const topic = {
        id: topicId,
        userId: 999, // Different user
        name: 'Topic',
        status: 'NOT_STARTED' as any,
        notes: null,
        category: 'Test',
        priority: TopicPriority.HIGH,
        dueDate: null,
        description: null,
        tags: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(topic);

      await expect(service.update(topicId, updateDto, userId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockPrismaService.topic.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const topicId = 1;
    const userId = 1;

    it('should delete a topic successfully', async () => {
      const topic = {
        id: topicId,
        name: 'Topic to delete',
        userId,
        status: 'NOT_STARTED' as any,
        notes: null,
        category: 'Test',
        priority: TopicPriority.HIGH,
        dueDate: null,
        description: null,
        tags: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(topic);
      mockPrismaService.topic.delete.mockResolvedValue(topic);

      const result = await service.remove(topicId, userId);

      expect(mockPrismaService.topic.delete).toHaveBeenCalledWith({
        where: { id: topicId },
      });
      expect(result).toEqual(topic);
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      mockPrismaService.topic.findUnique.mockResolvedValue(null);

      await expect(service.remove(topicId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.topic.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if trying to delete another users topic', async () => {
      const topic = {
        id: topicId,
        userId: 999, // Different user
        name: 'Topic',
        status: 'NOT_STARTED' as any,
        notes: null,
        category: 'Test',
        priority: TopicPriority.HIGH,
        dueDate: null,
        description: null,
        tags: null,
        color: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.topic.findUnique.mockResolvedValue(topic);

      await expect(service.remove(topicId, userId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockPrismaService.topic.delete).not.toHaveBeenCalled();
    });
  });
});
