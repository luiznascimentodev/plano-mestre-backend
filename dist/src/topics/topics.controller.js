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
exports.TopicController = void 0;
const common_1 = require("@nestjs/common");
const topics_service_1 = require("./topics.service");
const create_topic_dto_1 = require("./dto/create-topic.dto");
const update_topic_dto_1 = require("./dto/update-topic.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
let TopicController = class TopicController {
    topicService;
    constructor(topicService) {
        this.topicService = topicService;
    }
    create(createTopicDto, user) {
        return this.topicService.create(createTopicDto, user.id);
    }
    findAll(user) {
        return this.topicService.findAll(user.id);
    }
    findOne(id, user) {
        return this.topicService.findOne(id, user.id);
    }
    update(id, updateTopicDto, user) {
        return this.topicService.update(id, updateTopicDto, user.id);
    }
    remove(id, user) {
        return this.topicService.remove(id, user.id);
    }
};
exports.TopicController = TopicController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar um novo assunto de estudo' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_topic_dto_1.CreateTopicDto, Object]),
    __metadata("design:returntype", void 0)
], TopicController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os assuntos do usuário' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TopicController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar um assunto específico por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TopicController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar um assunto (notas)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_topic_dto_1.UpdateTopicDto, Object]),
    __metadata("design:returntype", void 0)
], TopicController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir um assunto' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TopicController.prototype, "remove", null);
exports.TopicController = TopicController = __decorate([
    (0, swagger_1.ApiTags)('3. Assuntos (Topics)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('topics'),
    __metadata("design:paramtypes", [topics_service_1.TopicsService])
], TopicController);
//# sourceMappingURL=topics.controller.js.map