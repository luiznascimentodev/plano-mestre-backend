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
exports.CreateHabitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateHabitDto {
    name;
    description;
    type;
    frequency;
    targetValue;
    color;
    icon;
    startDate;
    endDate;
    customDays;
    topicId;
}
exports.CreateHabitDto = CreateHabitDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do hábito',
        example: 'Estudar 25 minutos por dia',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome não pode estar vazio.' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descrição do hábito',
        required: false,
        example: 'Manter consistência nos estudos diários',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de hábito',
        required: false,
        enum: client_1.HabitType,
        example: client_1.HabitType.STUDY_TIME,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.HabitType),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Frequência do hábito',
        required: false,
        enum: client_1.HabitFrequency,
        example: client_1.HabitFrequency.DAILY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.HabitFrequency),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor alvo (ex: 25 minutos, 3 sessões)',
        required: false,
        example: 25,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateHabitDto.prototype, "targetValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cor em hexadecimal',
        required: false,
        example: '#3B82F6',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(7),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ícone/emoji para o hábito',
        required: false,
        example: '📚',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de início',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data limite (opcional)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dias da semana para frequência customizada (ex: "1,3,5" para seg, qua, sex)',
        required: false,
        example: '1,3,5',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHabitDto.prototype, "customDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do assunto relacionado (opcional)',
        required: false,
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateHabitDto.prototype, "topicId", void 0);
//# sourceMappingURL=create-habit.dto.js.map