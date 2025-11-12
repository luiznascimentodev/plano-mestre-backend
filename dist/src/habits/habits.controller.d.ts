import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CompleteHabitDto } from './dto/complete-habit.dto';
import { User } from '@prisma/client';
export declare class HabitsController {
    private readonly habitsService;
    constructor(habitsService: HabitsService);
    create(createHabitDto: CreateHabitDto, user: User): Promise<{
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
    findAll(user: User, includeInactive?: string): Promise<({
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
    findOne(id: number, user: User): Promise<{
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
    getStats(id: number, user: User): Promise<{
        totalCompletions: number;
        currentStreak: number;
        bestStreak: number;
        monthCompletions: number;
        completionRate: number;
        averageValue: number;
    }>;
    update(id: number, updateHabitDto: UpdateHabitDto, user: User): Promise<{
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
    remove(id: number, user: User): Promise<{
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
    complete(id: number, completeHabitDto: CompleteHabitDto, user: User): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        notes: string | null;
        completedAt: Date;
        value: number | null;
        habitId: number;
    }>;
    uncomplete(id: number, completionId: number, user: User): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        notes: string | null;
        completedAt: Date;
        value: number | null;
        habitId: number;
    }>;
}
