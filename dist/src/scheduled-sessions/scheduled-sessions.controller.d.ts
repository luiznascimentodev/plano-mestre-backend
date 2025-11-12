import { ScheduledSessionsService } from './scheduled-sessions.service';
import { CreateScheduledSessionDto } from './dto/create-scheduled-session.dto';
import { UpdateScheduledSessionDto } from './dto/update-scheduled-session.dto';
import { User } from '@prisma/client';
export declare class ScheduledSessionsController {
    private readonly scheduledSessionsService;
    constructor(scheduledSessionsService: ScheduledSessionsService);
    create(createScheduledSessionDto: CreateScheduledSessionDto, user: User): Promise<{
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
    findAll(user: User, date?: string, startDate?: string, endDate?: string, includeCompleted?: string): Promise<({
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
    update(id: number, updateScheduledSessionDto: UpdateScheduledSessionDto, user: User): Promise<{
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
    markAsCompleted(id: number, user: User): Promise<{
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
    remove(id: number, user: User): Promise<{
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
