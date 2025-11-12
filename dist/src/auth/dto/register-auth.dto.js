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
exports.RegisterAuthDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RegisterAuthDto {
    name;
    email;
    password;
}
exports.RegisterAuthDto = RegisterAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome do usuário', example: 'Luiz Nascimento' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome não pode estar vazio.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'O nome deve ter no máximo 100 caracteres.' }),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'E-mail único do usuário',
        example: 'luiz@email.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Por favor, insira um e-mail válido.' }),
    (0, class_validator_1.MaxLength)(255, { message: 'O e-mail deve ter no máximo 255 caracteres.' }),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Senha do usuário (mínimo 8 caracteres, deve conter letras e números)',
        example: 'MinhaSenh@123',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'A senha deve conter pelo menos 8 caracteres.' }),
    (0, class_validator_1.MaxLength)(128, { message: 'A senha deve ter no máximo 128 caracteres.' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'A senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número.',
    }),
    __metadata("design:type", String)
], RegisterAuthDto.prototype, "password", void 0);
//# sourceMappingURL=register-auth.dto.js.map