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
exports.HabitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HabitsService = class HabitsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        if (dto.topicId) {
            const topic = await this.prisma.topic.findUnique({
                where: { id: dto.topicId },
            });
            if (!topic) {
                throw new common_1.NotFoundException('Assunto não encontrado.');
            }
            if (topic.userId !== userId) {
                throw new common_1.ForbiddenException('Você não tem permissão para criar hábito neste assunto.');
            }
        }
        return this.prisma.habit.create({
            data: {
                name: dto.name,
                description: dto.description,
                type: dto.type,
                frequency: dto.frequency,
                targetValue: dto.targetValue,
                color: dto.color,
                icon: dto.icon,
                startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                customDays: dto.customDays,
                topicId: dto.topicId,
                userId: userId,
            },
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async findAll(userId, includeInactive = false) {
        const where = {
            userId,
        };
        if (!includeInactive) {
            where.isActive = true;
        }
        return this.prisma.habit.findMany({
            where,
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                completions: {
                    orderBy: {
                        completedAt: 'desc',
                    },
                    take: 30,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id, userId) {
        const habit = await this.prisma.habit.findUnique({
            where: { id },
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                completions: {
                    orderBy: {
                        completedAt: 'desc',
                    },
                },
            },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Hábito não encontrado.');
        }
        if (habit.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para acessar este hábito.');
        }
        return habit;
    }
    async update(id, dto, userId) {
        const habit = await this.prisma.habit.findUnique({
            where: { id },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Hábito não encontrado.');
        }
        if (habit.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para atualizar este hábito.');
        }
        if (dto.topicId !== undefined) {
            if (dto.topicId === null) {
            }
            else {
                const topic = await this.prisma.topic.findUnique({
                    where: { id: dto.topicId },
                });
                if (!topic) {
                    throw new common_1.NotFoundException('Assunto não encontrado.');
                }
                if (topic.userId !== userId) {
                    throw new common_1.ForbiddenException('Você não tem permissão para usar este assunto.');
                }
            }
        }
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.type !== undefined)
            updateData.type = dto.type;
        if (dto.frequency !== undefined)
            updateData.frequency = dto.frequency;
        if (dto.targetValue !== undefined)
            updateData.targetValue = dto.targetValue;
        if (dto.color !== undefined)
            updateData.color = dto.color;
        if (dto.icon !== undefined)
            updateData.icon = dto.icon;
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        if (dto.startDate !== undefined)
            updateData.startDate = dto.startDate ? new Date(dto.startDate) : undefined;
        if (dto.endDate !== undefined)
            updateData.endDate = dto.endDate ? new Date(dto.endDate) : dto.endDate === null ? null : undefined;
        if (dto.customDays !== undefined)
            updateData.customDays = dto.customDays;
        if (dto.topicId !== undefined)
            updateData.topicId = dto.topicId;
        return this.prisma.habit.update({
            where: { id },
            data: updateData,
            include: {
                topic: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async remove(id, userId) {
        const habit = await this.prisma.habit.findUnique({
            where: { id },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Hábito não encontrado.');
        }
        if (habit.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para excluir este hábito.');
        }
        return this.prisma.habit.delete({
            where: { id },
        });
    }
    async complete(id, dto, userId) {
        const habit = await this.prisma.habit.findUnique({
            where: { id },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Hábito não encontrado.');
        }
        if (habit.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para completar este hábito.');
        }
        if (!habit.isActive) {
            throw new common_1.BadRequestException('Este hábito está inativo.');
        }
        const completedAt = dto.completedAt
            ? new Date(dto.completedAt)
            : new Date();
        completedAt.setHours(0, 0, 0, 0);
        const existingCompletion = await this.prisma.habitCompletion.findFirst({
            where: {
                habitId: id,
                completedAt: {
                    gte: completedAt,
                    lt: new Date(completedAt.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });
        if (existingCompletion) {
            throw new common_1.BadRequestException('Este hábito já foi completado nesta data.');
        }
        return this.prisma.habitCompletion.create({
            data: {
                habitId: id,
                userId: userId,
                value: dto.value,
                notes: dto.notes,
                completedAt: completedAt,
            },
        });
    }
    async uncomplete(id, completionId, userId) {
        const habit = await this.prisma.habit.findUnique({
            where: { id },
        });
        if (!habit) {
            throw new common_1.NotFoundException('Hábito não encontrado.');
        }
        if (habit.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para gerenciar este hábito.');
        }
        const completion = await this.prisma.habitCompletion.findUnique({
            where: { id: completionId },
        });
        if (!completion) {
            throw new common_1.NotFoundException('Conclusão não encontrada.');
        }
        if (completion.userId !== userId || completion.habitId !== id) {
            throw new common_1.ForbiddenException('Você não tem permissão para remover esta conclusão.');
        }
        return this.prisma.habitCompletion.delete({
            where: { id: completionId },
        });
    }
    async getStats(id, userId) {
        const habit = await this.findOne(id, userId);
        const completions = await this.prisma.habitCompletion.findMany({
            where: {
                habitId: id,
                userId: userId,
            },
            orderBy: {
                completedAt: 'asc',
            },
        });
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sortedCompletions = [...completions].sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
        for (let i = 0; i < sortedCompletions.length; i++) {
            const completionDate = new Date(sortedCompletions[i].completedAt);
            completionDate.setHours(0, 0, 0, 0);
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            if (completionDate.getTime() === expectedDate.getTime() ||
                (i === 0 && completionDate.getTime() >= today.getTime() - 86400000)) {
                currentStreak++;
            }
            else {
                break;
            }
        }
        let bestStreak = 0;
        let tempStreak = 0;
        let lastDate = null;
        for (const completion of sortedCompletions.reverse()) {
            const completionDate = new Date(completion.completedAt);
            completionDate.setHours(0, 0, 0, 0);
            if (lastDate === null) {
                tempStreak = 1;
                lastDate = completionDate;
            }
            else {
                const diffDays = (lastDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    tempStreak++;
                }
                else {
                    bestStreak = Math.max(bestStreak, tempStreak);
                    tempStreak = 1;
                }
                lastDate = completionDate;
            }
        }
        bestStreak = Math.max(bestStreak, tempStreak);
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const monthCompletions = completions.filter((c) => {
            const date = new Date(c.completedAt);
            return date >= firstDay && date <= lastDay;
        });
        const daysInMonth = lastDay.getDate();
        const completionRate = (monthCompletions.length / daysInMonth) * 100;
        return {
            totalCompletions: completions.length,
            currentStreak,
            bestStreak,
            monthCompletions: monthCompletions.length,
            completionRate: Math.round(completionRate),
            averageValue: completions.length > 0
                ? Math.round(completions.reduce((acc, c) => acc + (c.value || 0), 0) /
                    completions.length)
                : 0,
        };
    }
};
exports.HabitsService = HabitsService;
exports.HabitsService = HabitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HabitsService);
//# sourceMappingURL=habits.service.js.map