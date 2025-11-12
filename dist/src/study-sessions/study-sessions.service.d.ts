import { PrismaService } from '../prisma/prisma.service';
import { CreateStudySessionDto } from './dto/create-session.dto';
export declare class StudySessionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateStudySessionDto, userId: number): Promise<{
        id: number;
        userId: number;
        duration: number;
        topicId: number;
        completedAt: Date;
    }>;
    findAll(userId: number): Promise<({
        topic: {
            name: string;
            id: number;
            status: import(".prisma/client").$Enums.StudyStatus;
        };
    } & {
        id: number;
        userId: number;
        duration: number;
        topicId: number;
        completedAt: Date;
    })[]>;
    getDailyStats(userId: number, date?: Date): Promise<{
        date: string;
        totalMinutes: number;
        sessionCount: number;
        topicsStudied: number;
        byTopic: {
            topicId: number;
            topicName: string;
            totalMinutes: number;
            sessionCount: number;
        }[];
    }>;
    getWeeklyStats(userId: number, days?: number): Promise<{
        date: string;
        totalMinutes: number;
        sessionCount: number;
        topicsStudied: number;
        byTopic: {
            topicId: number;
            topicName: string;
            totalMinutes: number;
            sessionCount: number;
        }[];
    }[]>;
    getAdvancedDailyMetrics(userId: number, date?: Date): Promise<{
        date: string;
        basic: {
            totalMinutes: number;
            sessionCount: number;
            avgSessionDuration: number;
            topicsStudied: number;
        };
        temporal: {
            hourlyDistribution: {
                hour: number;
                minutes: number;
                sessionCount: number;
            }[];
            peakHours: number[];
            avgInterval: number;
        };
        comparison: {
            vsHistoricalAverage: number;
            vsHistoricalAveragePercent: number;
            vsLast7Days: number;
            vsLast7DaysPercent: number;
            trend: string;
        };
        analysis: {
            diversityScore: number;
            efficiency: number;
            consistencyScore: number;
            weeklyGrowth: number;
        };
        prediction: {
            tomorrowPrediction: number;
        };
        byTopic: {
            topicId: number;
            topicName: string;
            sessionCount: number;
            totalMinutes: number;
            percentage: number;
        }[];
    }>;
}
