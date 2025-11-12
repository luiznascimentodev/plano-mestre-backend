"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackEvent(dto, userId, userAgent, ipAddress, sessionId) {
        return this.prisma.analyticsEvent.create({
            data: {
                eventType: dto.eventType,
                entityType: dto.entityType,
                entityId: dto.entityId,
                metadata: dto.metadata || {},
                duration: dto.duration,
                userId: userId,
                userAgent: userAgent,
                ipAddress: ipAddress,
                sessionId: sessionId,
            },
        });
    }
    async getUserAnalytics(userId, startDate, endDate, eventTypes) {
        const where = {
            userId,
        };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        if (eventTypes && eventTypes.length > 0) {
            where.eventType = { in: eventTypes };
        }
        const events = await this.prisma.analyticsEvent.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });
        return events;
    }
    async getDailyStats(userId, date) {
        const targetDate = date || new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const events = await this.prisma.analyticsEvent.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });
        const eventsByType = events.reduce((acc, event) => {
            acc[event.eventType] = (acc[event.eventType] || 0) + 1;
            return acc;
        }, {});
        const sessionEvents = events.filter((e) => e.eventType === client_1.AnalyticsEventType.STUDY_SESSION_STARTED ||
            e.eventType === client_1.AnalyticsEventType.STUDY_SESSION_COMPLETED);
        const totalSessionDuration = sessionEvents.reduce((acc, e) => acc + (e.duration || 0), 0);
        const pageViews = events.filter((e) => e.eventType === client_1.AnalyticsEventType.PAGE_VIEWED);
        const pagesByPath = pageViews.reduce((acc, event) => {
            const path = event.metadata?.path || 'unknown';
            acc[path] = (acc[path] || 0) + 1;
            return acc;
        }, {});
        const featureAccesses = events.filter((e) => e.eventType === client_1.AnalyticsEventType.FEATURE_ACCESSED);
        const featuresByType = featureAccesses.reduce((acc, event) => {
            const feature = event.metadata?.feature || 'unknown';
            acc[feature] = (acc[feature] || 0) + 1;
            return acc;
        }, {});
        return {
            totalEvents: events.length,
            eventsByType,
            totalSessionDuration,
            pagesByPath,
            featuresByType,
            events,
        };
    }
    async getWeeklyStats(userId, days = 7) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const events = await this.prisma.analyticsEvent.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        const eventsByDay = {};
        events.forEach((event) => {
            const day = event.createdAt.toISOString().split('T')[0];
            if (!eventsByDay[day]) {
                eventsByDay[day] = [];
            }
            eventsByDay[day].push(event);
        });
        const dailyStats = Object.entries(eventsByDay).map(([day, dayEvents]) => {
            const sessionEvents = dayEvents.filter((e) => e.eventType === client_1.AnalyticsEventType.STUDY_SESSION_STARTED ||
                e.eventType === client_1.AnalyticsEventType.STUDY_SESSION_COMPLETED);
            const totalDuration = sessionEvents.reduce((acc, e) => acc + (e.duration || 0), 0);
            return {
                date: day,
                totalEvents: dayEvents.length,
                sessionDuration: totalDuration,
                topicsCreated: dayEvents.filter((e) => e.eventType === client_1.AnalyticsEventType.TOPIC_CREATED).length,
                flashcardsReviewed: dayEvents.filter((e) => e.eventType === client_1.AnalyticsEventType.FLASHCARD_REVIEWED).length,
                habitsCompleted: dayEvents.filter((e) => e.eventType === client_1.AnalyticsEventType.HABIT_COMPLETED).length,
            };
        });
        return {
            period: { startDate, endDate },
            totalEvents: events.length,
            dailyStats,
            events,
        };
    }
    async getFeatureUsageStats(userId, days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const events = await this.prisma.analyticsEvent.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const featureCounts = {};
        const featureDurations = {};
        events.forEach((event) => {
            if (event.eventType === client_1.AnalyticsEventType.FEATURE_ACCESSED) {
                const feature = event.metadata?.feature || 'unknown';
                featureCounts[feature] = (featureCounts[feature] || 0) + 1;
                if (event.duration) {
                    featureDurations[feature] =
                        (featureDurations[feature] || 0) + event.duration;
                }
            }
        });
        const eventTypeCounts = {};
        events.forEach((event) => {
            eventTypeCounts[event.eventType] =
                (eventTypeCounts[event.eventType] || 0) + 1;
        });
        return {
            period: { startDate, endDate },
            featureCounts,
            featureDurations,
            eventTypeCounts,
            totalEvents: events.length,
        };
    }
    async getEngagementMetrics(userId, days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const events = await this.prisma.analyticsEvent.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const activeDays = new Set(events.map((e) => e.createdAt.toISOString().split('T')[0])).size;
        const studySessions = events.filter((e) => e.eventType === client_1.AnalyticsEventType.STUDY_SESSION_COMPLETED).length;
        const totalStudyTime = events
            .filter((e) => e.eventType === client_1.AnalyticsEventType.STUDY_SESSION_COMPLETED)
            .reduce((acc, e) => acc + (e.duration || 0), 0);
        const totalInteractions = events.length;
        const uniqueFeatures = new Set(events
            .filter((e) => e.eventType === client_1.AnalyticsEventType.FEATURE_ACCESSED)
            .map((e) => e.metadata?.feature)).size;
        const dates = Array.from(new Set(events.map((e) => e.createdAt.toISOString().split('T')[0])))
            .sort()
            .map((d) => new Date(d));
        let consecutiveDays = 0;
        let maxConsecutive = 0;
        let currentStreak = 0;
        for (let i = 0; i < dates.length; i++) {
            if (i === 0) {
                currentStreak = 1;
            }
            else {
                const diffDays = (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    currentStreak++;
                }
                else {
                    maxConsecutive = Math.max(maxConsecutive, currentStreak);
                    currentStreak = 1;
                }
            }
        }
        maxConsecutive = Math.max(maxConsecutive, currentStreak);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const hasToday = dates.some((d) => d.toISOString().split('T')[0] === today.toISOString().split('T')[0]);
        const hasYesterday = dates.some((d) => d.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]);
        if (hasToday || hasYesterday) {
            consecutiveDays = currentStreak;
        }
        return {
            period: { startDate, endDate },
            activeDays,
            totalDays: days,
            engagementRate: (activeDays / days) * 100,
            studySessions,
            totalStudyTime,
            totalInteractions,
            uniqueFeatures,
            maxConsecutiveDays: maxConsecutive,
            currentStreak: consecutiveDays,
            averageEventsPerDay: activeDays > 0 ? totalInteractions / activeDays : 0,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map