import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    track(createEventDto: CreateAnalyticsEventDto, user: User, req: Request): Promise<{
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
    getDailyStats(user: User, date?: string): Promise<{
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
    getWeeklyStats(user: User, days?: string): Promise<{
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
    getFeatureUsage(user: User, days?: string): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        featureCounts: Record<string, number>;
        featureDurations: Record<string, number>;
        eventTypeCounts: Record<string, number>;
        totalEvents: number;
    }>;
    getEngagement(user: User, days?: string): Promise<{
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
