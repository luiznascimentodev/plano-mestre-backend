import { HabitType, HabitFrequency } from '@prisma/client';
export declare class CreateHabitDto {
    name: string;
    description?: string;
    type?: HabitType;
    frequency?: HabitFrequency;
    targetValue?: number;
    color?: string;
    icon?: string;
    startDate?: string;
    endDate?: string;
    customDays?: string;
    topicId?: number;
}
