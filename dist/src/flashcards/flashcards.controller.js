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
exports.FlashcardsController = void 0;
const common_1 = require("@nestjs/common");
const flashcards_service_1 = require("./flashcards.service");
const create_flashcard_dto_1 = require("./dto/create-flashcard.dto");
const update_flashcard_dto_1 = require("./dto/update-flashcard.dto");
const review_flashcard_dto_1 = require("./dto/review-flashcard.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
let FlashcardsController = class FlashcardsController {
    flashcardsService;
    constructor(flashcardsService) {
        this.flashcardsService = flashcardsService;
    }
    create(createFlashcardDto, user) {
        return this.flashcardsService.create(createFlashcardDto, user.id);
    }
    findAll(user, topicId, due) {
        const topicIdNum = topicId ? parseInt(topicId, 10) : undefined;
        const isDue = due === 'true';
        if (isDue) {
            return this.flashcardsService.findDueForReview(user.id, topicIdNum);
        }
        return this.flashcardsService.findAll(user.id, topicIdNum);
    }
    findOne(id, user) {
        return this.flashcardsService.findOne(id, user.id);
    }
    update(id, updateFlashcardDto, user) {
        return this.flashcardsService.update(id, updateFlashcardDto, user.id);
    }
    review(id, reviewFlashcardDto, user) {
        return this.flashcardsService.review(id, reviewFlashcardDto, user.id);
    }
    remove(id, user) {
        return this.flashcardsService.remove(id, user.id);
    }
};
exports.FlashcardsController = FlashcardsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar um novo flashcard' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_flashcard_dto_1.CreateFlashcardDto, Object]),
    __metadata("design:returntype", void 0)
], FlashcardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os flashcards do usuário' }),
    (0, swagger_1.ApiQuery)({
        name: 'topicId',
        required: false,
        type: Number,
        description: 'Filtrar por assunto específico',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'due',
        required: false,
        type: Boolean,
        description: 'Apenas flashcards que precisam ser revisados',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('topicId')),
    __param(2, (0, common_1.Query)('due')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], FlashcardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um flashcard específico' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FlashcardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar um flashcard' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_flashcard_dto_1.UpdateFlashcardDto, Object]),
    __metadata("design:returntype", void 0)
], FlashcardsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, swagger_1.ApiOperation)({
        summary: 'Registrar uma revisão do flashcard (algoritmo de repetição espaçada)',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, review_flashcard_dto_1.ReviewFlashcardDto, Object]),
    __metadata("design:returntype", void 0)
], FlashcardsController.prototype, "review", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover um flashcard' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FlashcardsController.prototype, "remove", null);
exports.FlashcardsController = FlashcardsController = __decorate([
    (0, swagger_1.ApiTags)('5. Flashcards (Revisões)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('flashcards'),
    __metadata("design:paramtypes", [flashcards_service_1.FlashcardsService])
], FlashcardsController);
//# sourceMappingURL=flashcards.controller.js.map