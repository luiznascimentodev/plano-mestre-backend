import { HabitType, HabitFrequency } from '@prisma/client';
export declare class UpdateHabitDto {
    name?: string;
    description?: string;
    type?: HabitType;
    frequency?: HabitFrequency;
    targetValue?: number;
    color?: string;
    icon?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    customDays?: string;
    topicId?: number;
}
