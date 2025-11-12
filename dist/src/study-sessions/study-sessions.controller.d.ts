import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-session.dto';
import { User } from '@prisma/client';
export declare class StudySessionsController {
    private readonly studySessionService;
    constructor(studySessionService: StudySessionsService);
    create(createStudySessionDto: CreateStudySessionDto, user: User): Promise<{
        id: number;
        userId: number;
        duration: number;
        topicId: number;
        completedAt: Date;
    }>;
    findAll(user: User, stats?: string, date?: string, days?: string): Promise<{
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
    }> | Promise<{
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
    }> | Promise<{
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
    }[]> | Promise<({
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
}
