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
exports.CompleteHabitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CompleteHabitDto {
    value;
    notes;
    completedAt;
}
exports.CompleteHabitDto = CompleteHabitDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor completado (ex: minutos estudados, sessões feitas)',
        required: false,
        example: 25,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CompleteHabitDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas sobre a conclusão',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteHabitDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data de conclusão (padrão: hoje)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CompleteHabitDto.prototype, "completedAt", void 0);
//# sourceMappingURL=complete-habit.dto.js.map