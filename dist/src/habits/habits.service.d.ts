import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CompleteHabitDto } from './dto/complete-habit.dto';
export declare class HabitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateHabitDto, userId: number): Promise<{
        topic: {
            name: string;
            id: number;
        } | null;
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.HabitType;
        userId: number;
        color: string | null;
        topicId: number | null;
        startDate: Date;
        endDate: Date | null;
        frequency: import(".prisma/client").$Enums.HabitFrequency;
        targetValue: number | null;
        icon: string | null;
        customDays: string | null;
        isActive: boolean;
    }>;
    findAll(userId: number, includeInactive?: boolean): Promise<({
        topic: {
            name: string;
            id: number;
        } | null;
        completions: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            notes: string | null;
            completedAt: Date;
            value: number | null;
            habitId: number;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.HabitType;
        userId: number;
        color: string | null;
        topicId: number | null;
        startDate: Date;
        endDate: Date | null;
        frequency: import(".prisma/client").$Enums.HabitFrequency;
        targetValue: number | null;
        icon: string | null;
        customDays: string | null;
        isActive: boolean;
    })[]>;
    findOne(id: number, userId: number): Promise<{
        topic: {
            name: string;
            id: number;
        } | null;
        completions: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            notes: string | null;
            completedAt: Date;
            value: number | null;
            habitId: number;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.HabitType;
        userId: number;
        color: string | null;
        topicId: number | null;
        startDate: Date;
        endDate: Date | null;
        frequency: import(".prisma/client").$Enums.HabitFrequency;
        targetValue: number | null;
        icon: string | null;
        customDays: string | null;
        isActive: boolean;
    }>;
    update(id: number, dto: UpdateHabitDto, userId: number): Promise<{
        topic: {
            name: string;
            id: number;
        } | null;
    } & {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.HabitType;
        userId: number;
        color: string | null;
        topicId: number | null;
        startDate: Date;
        endDate: Date | null;
        frequency: import(".prisma/client").$Enums.HabitFrequency;
        targetValue: number | null;
        icon: string | null;
        customDays: string | null;
        isActive: boolean;
    }>;
    remove(id: number, userId: number): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.HabitType;
        userId: number;
        color: string | null;
        topicId: number | null;
        startDate: Date;
        endDate: Date | null;
        frequency: import(".prisma/client").$Enums.HabitFrequency;
        targetValue: number | null;
        icon: string | null;
        customDays: string | null;
        isActive: boolean;
    }>;
    complete(id: number, dto: CompleteHabitDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        notes: string | null;
        completedAt: Date;
        value: number | null;
        habitId: number;
    }>;
    uncomplete(id: number, completionId: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        notes: string | null;
        completedAt: Date;
        value: number | null;
        habitId: number;
    }>;
    getStats(id: number, userId: number): Promise<{
        totalCompletions: number;
        currentStreak: number;
        bestStreak: number;
        monthCompletions: number;
        completionRate: number;
        averageValue: number;
    }>;
}
