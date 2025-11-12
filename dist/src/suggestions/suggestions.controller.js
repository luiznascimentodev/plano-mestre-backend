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
exports.SuggestionsController = void 0;
const common_1 = require("@nestjs/common");
const suggestions_service_1 = require("./suggestions.service");
const create_suggestion_dto_1 = require("./dto/create-suggestion.dto");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let SuggestionsController = class SuggestionsController {
    suggestionsService;
    constructor(suggestionsService) {
        this.suggestionsService = suggestionsService;
    }
    async create(user, dto) {
        return this.suggestionsService.create(user.id, dto);
    }
};
exports.SuggestionsController = SuggestionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar uma sugestão ou feedback' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Sugestão enviada com sucesso.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dados inválidos.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Não autorizado.',
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_suggestion_dto_1.CreateSuggestionDto]),
    __metadata("design:returntype", Promise)
], SuggestionsController.prototype, "create", null);
exports.SuggestionsController = SuggestionsController = __decorate([
    (0, swagger_1.ApiTags)('Sugestões'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('suggestions'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [suggestions_service_1.SuggestionsService])
], SuggestionsController);
//# sourceMappingURL=suggestions.controller.js.map