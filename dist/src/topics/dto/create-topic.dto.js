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
exports.CreateTopicDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateTopicDto {
    name;
    category;
    priority;
    dueDate;
    description;
    tags;
    color;
}
exports.CreateTopicDto = CreateTopicDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome do Assunto que será estudado',
        example: 'Controle de Constitucionalidade',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome não pode estar vazio.' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateTopicDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoria do assunto (ex: Direito, Matemática, Português)',
        required: false,
        example: 'Direito Constitucional',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateTopicDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prioridade do assunto',
        required: false,
        enum: client_1.TopicPriority,
        example: client_1.TopicPriority.HIGH,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TopicPriority),
    __metadata("design:type", String)
], CreateTopicDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data limite para conclusão do assunto (ISO 8601)',
        required: false,
        example: '2025-12-31T23:59:59Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTopicDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descrição breve do assunto',
        required: false,
        example: 'Estudar os principais conceitos de controle de constitucionalidade',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateTopicDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tags separadas por vírgula para organização e busca',
        required: false,
        example: 'constitucional, direito, prova',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateTopicDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cor em hexadecimal para personalização visual',
        required: false,
        example: '#3B82F6',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(7),
    __metadata("design:type", String)
], CreateTopicDto.prototype, "color", void 0);
//# sourceMappingURL=create-topic.dto.js.map