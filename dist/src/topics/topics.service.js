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
exports.TopicsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TopicsService = class TopicsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        return this.prisma.topic.create({
            data: {
                name: dto.name,
                userId: userId,
                category: dto.category,
                priority: dto.priority,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
                description: dto.description,
                tags: dto.tags,
                color: dto.color,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.topic.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                status: 'asc',
            },
        });
    }
    async findOne(id, userId) {
        const topic = await this.prisma.topic.findUnique({
            where: { id: id },
        });
        if (!topic) {
            throw new common_1.NotFoundException('Assuntos não encontrado.');
        }
        if (topic.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para acessar este recurso.');
        }
        return topic;
    }
    async update(id, dto, userId) {
        const topic = await this.prisma.topic.findUnique({
            where: { id: id },
        });
        if (!topic) {
            throw new common_1.NotFoundException('Assunto não encontrado.');
        }
        if (topic.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para atualizar este assunto.');
        }
        const updateData = {};
        if (dto.notes !== undefined)
            updateData.notes = dto.notes;
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.category !== undefined)
            updateData.category = dto.category;
        if (dto.priority !== undefined)
            updateData.priority = dto.priority;
        if (dto.dueDate !== undefined) {
            updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
        }
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.tags !== undefined)
            updateData.tags = dto.tags;
        if (dto.color !== undefined)
            updateData.color = dto.color;
        return this.prisma.topic.update({
            where: { id: id },
            data: updateData,
        });
    }
    async remove(id, userId) {
        const topic = await this.prisma.topic.findUnique({
            where: { id },
        });
        if (!topic) {
            throw new common_1.NotFoundException('Assunto não encontrado.');
        }
        if (topic.userId !== userId) {
            throw new common_1.ForbiddenException('Você não tem permissão para excluir este assunto.');
        }
        return this.prisma.topic.delete({
            where: { id },
        });
    }
};
exports.TopicsService = TopicsService;
exports.TopicsService = TopicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TopicsService);
//# sourceMappingURL=topics.service.js.map