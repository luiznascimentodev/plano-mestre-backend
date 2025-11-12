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
exports.ScheduledSessionsController = void 0;
const common_1 = require("@nestjs/common");
const scheduled_sessions_service_1 = require("./scheduled-sessions.service");
const create_scheduled_session_dto_1 = require("./dto/create-scheduled-session.dto");
const update_scheduled_session_dto_1 = require("./dto/update-scheduled-session.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
let ScheduledSessionsController = class ScheduledSessionsController {
    scheduledSessionsService;
    constructor(scheduledSessionsService) {
        this.scheduledSessionsService = scheduledSessionsService;
    }
    create(createScheduledSessionDto, user) {
        return this.scheduledSessionsService.create(createScheduledSessionDto, user.id);
    }
    findAll(user, date, startDate, endDate, includeCompleted) {
        const includeCompletedBool = includeCompleted === 'true';
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return this.scheduledSessionsService.findByPeriod(user.id, start, end, includeCompletedBool);
        }
        const targetDate = date ? new Date(date) : undefined;
        return this.scheduledSessionsService.findAll(user.id, targetDate, includeCompletedBool);
    }
    update(id, updateScheduledSessionDto, user) {
        return this.scheduledSessionsService.update(id, updateScheduledSessionDto, user.id);
    }
    markAsCompleted(id, user) {
        return this.scheduledSessionsService.markAsCompleted(id, user.id);
    }
    remove(id, user) {
        return this.scheduledSessionsService.remove(id, user.id);
    }
};
exports.ScheduledSessionsController = ScheduledSessionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Agendar uma nova sessão de estudo' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scheduled_session_dto_1.CreateScheduledSessionDto, Object]),
    __metadata("design:returntype", void 0)
], ScheduledSessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar sessões agendadas' }),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        required: false,
        type: String,
        description: 'Data no formato YYYY-MM-DD (filtra por dia específico)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Data inicial no formato YYYY-MM-DD (para busca por período)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Data final no formato YYYY-MM-DD (para busca por período)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeCompleted',
        required: false,
        type: Boolean,
        description: 'Incluir sessões completadas',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('includeCompleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ScheduledSessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar uma sessão agendada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_scheduled_session_dto_1.UpdateScheduledSessionDto, Object]),
    __metadata("design:returntype", void 0)
], ScheduledSessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar sessão agendada como concluída' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ScheduledSessionsController.prototype, "markAsCompleted", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover uma sessão agendada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ScheduledSessionsController.prototype, "remove", null);
exports.ScheduledSessionsController = ScheduledSessionsController = __decorate([
    (0, swagger_1.ApiTags)('6. Sessões Agendadas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('scheduled-sessions'),
    __metadata("design:paramtypes", [scheduled_sessions_service_1.ScheduledSessionsService])
], ScheduledSessionsController);
//# sourceMappingURL=scheduled-sessions.controller.js.map