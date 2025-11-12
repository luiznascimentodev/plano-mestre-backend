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
exports.CreateAnalyticsEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateAnalyticsEventDto {
    eventType;
    entityType;
    entityId;
    metadata;
    duration;
}
exports.CreateAnalyticsEventDto = CreateAnalyticsEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo do evento',
        enum: client_1.AnalyticsEventType,
        example: client_1.AnalyticsEventType.STUDY_SESSION_STARTED,
    }),
    (0, class_validator_1.IsEnum)(client_1.AnalyticsEventType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo da entidade relacionada (ex: "topic", "flashcard")',
        required: false,
        example: 'topic',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAnalyticsEventDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID da entidade relacionada',
        required: false,
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAnalyticsEventDto.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Metadados adicionais em JSON',
        required: false,
        example: { duration: 25, topicName: 'Crase' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAnalyticsEventDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Duração em segundos (para ações com duração)',
        required: false,
        example: 1500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAnalyticsEventDto.prototype, "duration", void 0);
//# sourceMappingURL=create-analytics-event.dto.js.map