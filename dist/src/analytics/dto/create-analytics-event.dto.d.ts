import { AnalyticsEventType } from '@prisma/client';
export declare class CreateAnalyticsEventDto {
    eventType: AnalyticsEventType;
    entityType?: string;
    entityId?: number;
    metadata?: Record<string, any>;
    duration?: number;
}
