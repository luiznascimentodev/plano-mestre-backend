"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const scheduled_sessions_service_1 = require("./scheduled-sessions.service");
const scheduled_sessions_controller_1 = require("./scheduled-sessions.controller");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../prisma/prisma.module");
let ScheduledSessionsModule = class ScheduledSessionsModule {
};
exports.ScheduledSessionsModule = ScheduledSessionsModule;
exports.ScheduledSessionsModule = ScheduledSessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, prisma_module_1.PrismaModule],
        controllers: [scheduled_sessions_controller_1.ScheduledSessionsController],
        providers: [scheduled_sessions_service_1.ScheduledSessionsService],
    })
], ScheduledSessionsModule);
//# sourceMappingURL=scheduled-sessions.module.js.map