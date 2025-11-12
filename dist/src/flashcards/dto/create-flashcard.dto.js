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
exports.CreateFlashcardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateFlashcardDto {
    front;
    back;
    topicId;
    difficulty;
}
exports.CreateFlashcardDto = CreateFlashcardDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Frente do flashcard (pergunta)',
        example: 'O que é SOLID?',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A frente do flashcard não pode estar vazia.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlashcardDto.prototype, "front", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Verso do flashcard (resposta)',
        example: 'SOLID são 5 princípios de design de software: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O verso do flashcard não pode estar vazio.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlashcardDto.prototype, "back", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do assunto (Topic) relacionado',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFlashcardDto.prototype, "topicId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dificuldade inicial do flashcard',
        enum: client_1.FlashcardDifficulty,
        example: client_1.FlashcardDifficulty.MEDIUM,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.FlashcardDifficulty),
    __metadata("design:type", String)
], CreateFlashcardDto.prototype, "difficulty", void 0);
//# sourceMappingURL=create-flashcard.dto.js.map