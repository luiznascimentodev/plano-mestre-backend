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
exports.StudySessionsController = void 0;
const common_1 = require("@nestjs/common");
const study_sessions_service_1 = require("./study-sessions.service");
const create_session_dto_1 = require("./dto/create-session.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
let StudySessionsController = class StudySessionsController {
    studySessionService;
    constructor(studySessionService) {
        this.studySessionService = studySessionService;
    }
    create(createStudySessionDto, user) {
        return this.studySessionService.create(createStudySessionDto, user.id);
    }
    findAll(user, stats, date, days) {
        if (stats === 'daily') {
            const targetDate = date ? new Date(date) : new Date();
            return this.studySessionService.getDailyStats(user.id, targetDate);
        }
        if (stats === 'advanced') {
            const targetDate = date ? new Date(date) : new Date();
            return this.studySessionService.getAdvancedDailyMetrics(user.id, targetDate);
        }
        if (stats === 'weekly') {
            const daysNum = days ? parseInt(days, 10) : 7;
            return this.studySessionService.getWeeklyStats(user.id, daysNum);
        }
        return this.studySessionService.findAll(user.id);
    }
};
exports.StudySessionsController = StudySessionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Registrar uma sessão de estudo (ex: Pomodoro)',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_session_dto_1.CreateStudySessionDto, Object]),
    __metadata("design:returntype", void 0)
], StudySessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todas as sessões de estudo do usuário',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'stats',
        required: false,
        type: String,
        description: 'Tipo de estatísticas: "daily", "weekly" ou "advanced"',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        required: false,
        type: String,
        description: 'Data no formato YYYY-MM-DD (para stats=daily ou advanced)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        type: Number,
        description: 'Número de dias (para stats=weekly, padrão: 7)',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('stats')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], StudySessionsController.prototype, "findAll", null);
exports.StudySessionsController = StudySessionsController = __decorate([
    (0, swagger_1.ApiTags)('4. Sessões de Estudo (Pomodoro)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('study-sessions'),
    __metadata("design:paramtypes", [study_sessions_service_1.StudySessionsService])
], StudySessionsController);
//# sourceMappingURL=study-sessions.controller.js.map