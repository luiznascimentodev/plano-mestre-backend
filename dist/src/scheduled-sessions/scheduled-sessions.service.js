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
exports.ScheduledSessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ScheduledSessionsService = class ScheduledSessionsService {
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
            throw new common_1.ForbiddenException('Você não tem permissão para agendar sessões neste assunto.');
        }
        return this.prisma.scheduledSession.create({
            data: {
                scheduledAt: new Date(dto.scheduledAt),
                duration: dto.duration,
                topicId: dto.topicId,
                userId: userId,
                notes: dto.notes,
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
        });
    }
    async findAll(userId, date, includeCompleted = false) {
        const where = { userId };
        if (!includeCompleted) {
            where.isCompleted = false;
        }
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            where.scheduledAt = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        return this.prisma.scheduledSession.findMany({
            where,
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
                scheduledAt: 'asc',
            },
        });
    }
    async findByPeriod(userId, startDate, endDate, includeCompleted = false) {
        const where = {
            userId,
            scheduledAt: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (!includeCompleted) {
            where.isCompleted = false;
        }
        return this.prisma.scheduledSession.findMany({
            where,
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
                scheduledAt: 'asc',
            },
        });
    }
    async update(id, dto, userId) {
        const scheduled = await this.prisma.scheduledSession.findUnique({
            where: { id },
        });
        if (!scheduled) {
            throw new common_1.NotFoundException('Sessão agendada não encontrada.');
        }
        if (scheduled.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para editar esta sessão.');
        }
        return this.prisma.scheduledSession.update({
            where: { id },
            data: {
                ...(dto.scheduledAt && { scheduledAt: new Date(dto.scheduledAt) }),
                ...(dto.duration && { duration: dto.duration }),
                ...(dto.notes !== undefined && { notes: dto.notes }),
                ...(dto.topicId && { topicId: dto.topicId }),
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
        });
    }
    async markAsCompleted(id, userId) {
        const scheduled = await this.prisma.scheduledSession.findUnique({
            where: { id },
        });
        if (!scheduled) {
            throw new common_1.NotFoundException('Sessão agendada não encontrada.');
        }
        if (scheduled.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para completar esta sessão.');
        }
        return this.prisma.scheduledSession.update({
            where: { id },
            data: { isCompleted: true },
        });
    }
    async remove(id, userId) {
        const scheduled = await this.prisma.scheduledSession.findUnique({
            where: { id },
        });
        if (!scheduled) {
            throw new common_1.NotFoundException('Sessão agendada não encontrada.');
        }
        if (scheduled.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para remover esta sessão.');
        }
        return this.prisma.scheduledSession.delete({
            where: { id },
        });
    }
};
exports.ScheduledSessionsService = ScheduledSessionsService;
exports.ScheduledSessionsService = ScheduledSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScheduledSessionsService);
//# sourceMappingURL=scheduled-sessions.service.js.map