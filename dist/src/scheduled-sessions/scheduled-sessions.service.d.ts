import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduledSessionDto } from './dto/create-scheduled-session.dto';
export declare class ScheduledSessionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateScheduledSessionDto, userId: number): Promise<{
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
        notes: string | null;
        duration: number;
        topicId: number;
        scheduledAt: Date;
        isCompleted: boolean;
    }>;
    findAll(userId: number, date?: Date, includeCompleted?: boolean): Promise<({
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
        notes: string | null;
        duration: number;
        topicId: number;
        scheduledAt: Date;
        isCompleted: boolean;
    })[]>;
    findByPeriod(userId: number, startDate: Date, endDate: Date, includeCompleted?: boolean): Promise<({
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
        notes: string | null;
        duration: number;
        topicId: number;
        scheduledAt: Date;
        isCompleted: boolean;
    })[]>;
    update(id: number, dto: Partial<CreateScheduledSessionDto>, userId: number): Promise<{
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
        notes: string | null;
        duration: number;
        topicId: number;
        scheduledAt: Date;
        isCompleted: boolean;
    }>;
    markAsCompleted(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        notes: string | null;
        duration: number;
        topicId: number;
        scheduledAt: Date;
        isCompleted: boolean;
    }>;
    remove(id: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        notes: string | null;
        duration: number;
        topicId: number;
        scheduledAt: Date;
        isCompleted: boolean;
    }>;
}
