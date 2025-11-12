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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitsController = void 0;
const common_1 = require("@nestjs/common");
const habits_service_1 = require("./habits.service");
const create_habit_dto_1 = require("./dto/create-habit.dto");
const update_habit_dto_1 = require("./dto/update-habit.dto");
const complete_habit_dto_1 = require("./dto/complete-habit.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
let HabitsController = class HabitsController {
    habitsService;
    constructor(habitsService) {
        this.habitsService = habitsService;
    }
    create(createHabitDto, user) {
        return this.habitsService.create(createHabitDto, user.id);
    }
    findAll(user, includeInactive) {
        return this.habitsService.findAll(user.id, includeInactive === 'true');
    }
    findOne(id, user) {
        return this.habitsService.findOne(id, user.id);
    }
    getStats(id, user) {
        return this.habitsService.getStats(id, user.id);
    }
    update(id, updateHabitDto, user) {
        return this.habitsService.update(id, updateHabitDto, user.id);
    }
    remove(id, user) {
        return this.habitsService.remove(id, user.id);
    }
    complete(id, completeHabitDto, user) {
        return this.habitsService.complete(id, completeHabitDto, user.id);
    }
    uncomplete(id, completionId, user) {
        return this.habitsService.uncomplete(id, completionId, user.id);
    }
};
exports.HabitsController = HabitsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar um novo hábito' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_habit_dto_1.CreateHabitDto, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os hábitos do usuário' }),
    (0, swagger_1.ApiQuery)({
        name: 'includeInactive',
        required: false,
        type: Boolean,
        description: 'Incluir hábitos inativos',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um hábito específico' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas de um hábito' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar um hábito' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_habit_dto_1.UpdateHabitDto, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir um hábito' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar hábito como completado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, complete_habit_dto_1.CompleteHabitDto, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "complete", null);
__decorate([
    (0, common_1.Delete)(':id/completions/:completionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover uma conclusão de hábito' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('completionId', common_1.ParseIntPipe)),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "uncomplete", null);
exports.HabitsController = HabitsController = __decorate([
    (0, swagger_1.ApiTags)('7. Hábitos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('habits'),
    __metadata("design:paramtypes", [habits_service_1.HabitsService])
], HabitsController);
//# sourceMappingURL=habits.controller.js.map