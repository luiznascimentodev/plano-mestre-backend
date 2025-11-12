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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const create_analytics_event_dto_1 = require("./dto/create-analytics-event.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    track(createEventDto, user, req) {
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip || req.socket.remoteAddress;
        const sessionId = req.headers['x-session-id'] || undefined;
        return this.analyticsService.trackEvent(createEventDto, user.id, userAgent, ipAddress, sessionId);
    }
    getDailyStats(user, date) {
        const targetDate = date ? new Date(date) : new Date();
        return this.analyticsService.getDailyStats(user.id, targetDate);
    }
    getWeeklyStats(user, days) {
        const daysNum = days ? parseInt(days, 10) : 7;
        return this.analyticsService.getWeeklyStats(user.id, daysNum);
    }
    getFeatureUsage(user, days) {
        const daysNum = days ? parseInt(days, 10) : 30;
        return this.analyticsService.getFeatureUsageStats(user.id, daysNum);
    }
    getEngagement(user, days) {
        const daysNum = days ? parseInt(days, 10) : 30;
        return this.analyticsService.getEngagementMetrics(user.id, daysNum);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Post)('track'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar um evento de analytics' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_analytics_event_dto_1.CreateAnalyticsEventDto, Object, Object]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "track", null);
__decorate([
    (0, common_1.Get)('daily'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas diárias de analytics' }),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        required: false,
        type: String,
        description: 'Data no formato YYYY-MM-DD',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getDailyStats", null);
__decorate([
    (0, common_1.Get)('weekly'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas semanais de analytics' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        type: Number,
        description: 'Número de dias (padrão: 7)',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getWeeklyStats", null);
__decorate([
    (0, common_1.Get)('features'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter estatísticas de uso de features' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        type: Number,
        description: 'Número de dias (padrão: 30)',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getFeatureUsage", null);
__decorate([
    (0, common_1.Get)('engagement'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter métricas de engajamento' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        type: Number,
        description: 'Número de dias (padrão: 30)',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getEngagement", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('8. Analytics (Tracking)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map