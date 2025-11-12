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
exports.StudySessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StudySessionsService = class StudySessionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        const topic = await this.prisma.topic.findUnique({
            where: { id: dto.topicId },
        });
        if (!topic) {
            throw new common_1.NotFoundException('Assunto (Topic) não encontrado.');
        }
        if (topic.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para este assunto.');
        }
        return this.prisma.$transaction(async (tx) => {
            const session = await tx.studySession.create({
                data: {
                    duration: dto.duration,
                    userId: userId,
                    topicId: dto.topicId
                },
            });
            if (topic.status === client_1.StudyStatus.NOT_STARTED) {
                await tx.topic.update({
                    where: { id: dto.topicId },
                    data: {
                        status: client_1.StudyStatus.IN_PROGRESS,
                    },
                });
            }
            return session;
        });
    }
    async findAll(userId) {
        return this.prisma.studySession.findMany({
            where: {
                userId: userId,
            },
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                completedAt: 'desc',
            },
        });
    }
    async getDailyStats(userId, date) {
        const targetDate = date || new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const sessions = await this.prisma.studySession.findMany({
            where: {
                userId: userId,
                completedAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                completedAt: 'asc',
            },
        });
        const totalMinutes = sessions.reduce((acc, session) => acc + session.duration, 0);
        const sessionCount = sessions.length;
        const uniqueTopics = new Set(sessions.map((s) => s.topicId));
        const topicsStudied = uniqueTopics.size;
        const byTopicMap = new Map();
        sessions.forEach((session) => {
            const existing = byTopicMap.get(session.topicId);
            if (existing) {
                existing.totalMinutes += session.duration;
                existing.sessionCount += 1;
            }
            else {
                byTopicMap.set(session.topicId, {
                    topicId: session.topicId,
                    topicName: session.topic.name,
                    totalMinutes: session.duration,
                    sessionCount: 1,
                });
            }
        });
        const byTopic = Array.from(byTopicMap.values());
        return {
            date: targetDate.toISOString().split('T')[0],
            totalMinutes,
            sessionCount,
            topicsStudied,
            byTopic,
        };
    }
    async getWeeklyStats(userId, days = 7) {
        const stats = [];
        const today = new Date();
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayStats = await this.getDailyStats(userId, date);
            stats.push(dayStats);
        }
        return stats.reverse();
    }
    async getAdvancedDailyMetrics(userId, date) {
        const targetDate = date || new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const sessions = await this.prisma.studySession.findMany({
            where: {
                userId: userId,
                completedAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                completedAt: 'asc',
            },
        });
        const thirtyDaysAgo = new Date(targetDate);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const historicalSessions = await this.prisma.studySession.findMany({
            where: {
                userId: userId,
                completedAt: {
                    gte: thirtyDaysAgo,
                    lt: startOfDay,
                },
            },
        });
        const totalMinutes = sessions.reduce((acc, session) => acc + session.duration, 0);
        const sessionCount = sessions.length;
        const avgSessionDuration = sessionCount > 0 ? totalMinutes / sessionCount : 0;
        const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            minutes: 0,
            sessionCount: 0,
        }));
        sessions.forEach((session) => {
            const hour = new Date(session.completedAt).getHours();
            hourlyDistribution[hour].minutes += session.duration;
            hourlyDistribution[hour].sessionCount += 1;
        });
        const peakHours = hourlyDistribution
            .map((h, idx) => ({ ...h, index: idx }))
            .sort((a, b) => b.minutes - a.minutes)
            .slice(0, 3)
            .map((h) => h.index);
        const intervals = [];
        for (let i = 1; i < sessions.length; i++) {
            const diff = (new Date(sessions[i].completedAt).getTime() -
                new Date(sessions[i - 1].completedAt).getTime()) /
                (1000 * 60);
            intervals.push(diff);
        }
        const avgInterval = intervals.length > 0
            ? intervals.reduce((a, b) => a + b, 0) / intervals.length
            : 0;
        const historicalTotal = historicalSessions.reduce((acc, s) => acc + s.duration, 0);
        const historicalDays = 30;
        const historicalDailyAverage = historicalTotal / historicalDays;
        const vsAverage = totalMinutes - historicalDailyAverage;
        const vsAveragePercent = historicalDailyAverage > 0
            ? ((vsAverage / historicalDailyAverage) * 100).toFixed(1)
            : '0';
        const topicCounts = new Map();
        sessions.forEach((s) => {
            topicCounts.set(s.topicId, (topicCounts.get(s.topicId) || 0) + 1);
        });
        const uniqueTopics = topicCounts.size;
        const totalSessions = sessions.length;
        const diversityScore = totalSessions > 0
            ? (uniqueTopics / totalSessions) * 100
            : 0;
        const efficiency = uniqueTopics > 0 ? totalMinutes / uniqueTopics : 0;
        const last7Days = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date(targetDate);
            date.setDate(date.getDate() - i);
            const stats = await this.getDailyStats(userId, date);
            last7Days.push(stats.totalMinutes);
        }
        const last7DaysAvg = last7Days.reduce((a, b) => a + b, 0) / last7Days.length;
        const trend = totalMinutes > last7DaysAvg ? 'up' : totalMinutes < last7DaysAvg ? 'down' : 'stable';
        const trendPercent = last7DaysAvg > 0
            ? Math.abs(((totalMinutes - last7DaysAvg) / last7DaysAvg) * 100).toFixed(1)
            : '0';
        const variance = last7Days.reduce((acc, val) => acc + Math.pow(val - last7DaysAvg, 2), 0) /
            last7Days.length;
        const stdDev = Math.sqrt(variance);
        const consistencyScore = last7DaysAvg > 0
            ? Math.max(0, 100 - (stdDev / last7DaysAvg) * 100)
            : 0;
        const tomorrowPrediction = last7DaysAvg;
        const thisWeek = last7Days.slice(0, 7);
        const lastWeek = [];
        for (let i = 8; i <= 14; i++) {
            const date = new Date(targetDate);
            date.setDate(date.getDate() - i);
            const stats = await this.getDailyStats(userId, date);
            lastWeek.push(stats.totalMinutes);
        }
        const thisWeekTotal = thisWeek.reduce((a, b) => a + b, 0);
        const lastWeekTotal = lastWeek.reduce((a, b) => a + b, 0);
        const weeklyGrowth = lastWeekTotal > 0
            ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
            : 0;
        return {
            date: targetDate.toISOString().split('T')[0],
            basic: {
                totalMinutes,
                sessionCount,
                avgSessionDuration: Math.round(avgSessionDuration),
                topicsStudied: uniqueTopics,
            },
            temporal: {
                hourlyDistribution,
                peakHours,
                avgInterval: Math.round(avgInterval),
            },
            comparison: {
                vsHistoricalAverage: Math.round(vsAverage),
                vsHistoricalAveragePercent: parseFloat(vsAveragePercent),
                vsLast7Days: Math.round(totalMinutes - last7DaysAvg),
                vsLast7DaysPercent: parseFloat(trendPercent),
                trend,
            },
            analysis: {
                diversityScore: Math.round(diversityScore),
                efficiency: Math.round(efficiency),
                consistencyScore: Math.round(consistencyScore),
                weeklyGrowth: Math.round(weeklyGrowth * 100) / 100,
            },
            prediction: {
                tomorrowPrediction: Math.round(tomorrowPrediction),
            },
            byTopic: Array.from(topicCounts.entries()).map(([topicId, count]) => {
                const topic = sessions.find((s) => s.topicId === topicId)?.topic;
                const topicMinutes = sessions
                    .filter((s) => s.topicId === topicId)
                    .reduce((acc, s) => acc + s.duration, 0);
                return {
                    topicId,
                    topicName: topic?.name || 'Desconhecido',
                    sessionCount: count,
                    totalMinutes: topicMinutes,
                    percentage: totalMinutes > 0 ? (topicMinutes / totalMinutes) * 100 : 0,
                };
            }),
        };
    }
};
exports.StudySessionsService = StudySessionsService;
exports.StudySessionsService = StudySessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudySessionsService);
//# sourceMappingURL=study-sessions.service.js.map