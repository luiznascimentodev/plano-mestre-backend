import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';
import { AnalyticsEventType } from '@prisma/client';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    trackEvent(dto: CreateAnalyticsEventDto, userId: number, userAgent?: string, ipAddress?: string, sessionId?: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        entityType: string | null;
        entityId: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        duration: number | null;
        eventType: import(".prisma/client").$Enums.AnalyticsEventType;
        sessionId: string | null;
    }>;
    getUserAnalytics(userId: number, startDate?: Date, endDate?: Date, eventTypes?: AnalyticsEventType[]): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        entityType: string | null;
        entityId: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        duration: number | null;
        eventType: import(".prisma/client").$Enums.AnalyticsEventType;
        sessionId: string | null;
    }[]>;
    getDailyStats(userId: number, date?: Date): Promise<{
        totalEvents: number;
        eventsByType: Record<string, number>;
        totalSessionDuration: number;
        pagesByPath: Record<string, number>;
        featuresByType: Record<string, number>;
        events: {
            id: number;
            createdAt: Date;
            userId: number;
            entityType: string | null;
            entityId: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            duration: number | null;
            eventType: import(".prisma/client").$Enums.AnalyticsEventType;
            sessionId: string | null;
        }[];
    }>;
    getWeeklyStats(userId: number, days?: number): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        totalEvents: number;
        dailyStats: {
            date: string;
            totalEvents: number;
            sessionDuration: any;
            topicsCreated: number;
            flashcardsReviewed: number;
            habitsCompleted: number;
        }[];
        events: {
            id: number;
            createdAt: Date;
            userId: number;
            entityType: string | null;
            entityId: number | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            duration: number | null;
            eventType: import(".prisma/client").$Enums.AnalyticsEventType;
            sessionId: string | null;
        }[];
    }>;
    getFeatureUsageStats(userId: number, days?: number): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        featureCounts: Record<string, number>;
        featureDurations: Record<string, number>;
        eventTypeCounts: Record<string, number>;
        totalEvents: number;
    }>;
    getEngagementMetrics(userId: number, days?: number): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        activeDays: number;
        totalDays: number;
        engagementRate: number;
        studySessions: number;
        totalStudyTime: number;
        totalInteractions: number;
        uniqueFeatures: number;
        maxConsecutiveDays: number;
        currentStreak: number;
        averageEventsPerDay: number;
    }>;
}
