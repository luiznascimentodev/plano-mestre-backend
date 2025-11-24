"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeInterceptor = void 0;
const common_1 = require("@nestjs/common");
let SanitizeInterceptor = class SanitizeInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request.body) {
            this.sanitizeObject(request.body);
        }
        if (request.query) {
            this.sanitizeObject(request.query);
        }
        if (request.params) {
            this.sanitizeObject(request.params);
        }
        return next.handle();
    }
    sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object')
            return;
        const dangerousFields = ['__proto__', 'constructor', 'prototype'];
        for (const key in obj) {
            if (dangerousFields.includes(key)) {
                delete obj[key];
                continue;
            }
            const value = obj[key];
            if (typeof value === 'string') {
                obj[key] = value
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                    .trim();
            }
            if (typeof value === 'object' && value !== null) {
                this.sanitizeObject(value);
            }
        }
    }
};
exports.SanitizeInterceptor = SanitizeInterceptor;
exports.SanitizeInterceptor = SanitizeInterceptor = __decorate([
    (0, common_1.Injectable)()
], SanitizeInterceptor);
//# sourceMappingURL=sanitize.interceptor.js.map