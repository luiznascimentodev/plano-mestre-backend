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
exports.DailyStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DailyStatsDto {
    date;
    totalMinutes;
    sessionCount;
    topicsStudied;
    byTopic;
}
exports.DailyStatsDto = DailyStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data do dia' }),
    __metadata("design:type", String)
], DailyStatsDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de minutos estudados no dia' }),
    __metadata("design:type", Number)
], DailyStatsDto.prototype, "totalMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de sessões completadas' }),
    __metadata("design:type", Number)
], DailyStatsDto.prototype, "sessionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assuntos estudados (IDs únicos)' }),
    __metadata("design:type", Number)
], DailyStatsDto.prototype, "topicsStudied", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sessões agrupadas por assunto',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                topicId: { type: 'number' },
                topicName: { type: 'string' },
                totalMinutes: { type: 'number' },
                sessionCount: { type: 'number' },
            },
        },
    }),
    __metadata("design:type", Array)
], DailyStatsDto.prototype, "byTopic", void 0);
//# sourceMappingURL=daily-stats.dto.js.map