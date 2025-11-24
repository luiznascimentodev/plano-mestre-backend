import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Sanitizar body removendo campos perigosos
    if (request.body) {
      this.sanitizeObject(request.body);
    }

    // Sanitizar query params
    if (request.query) {
      this.sanitizeObject(request.query);
    }

    // Sanitizar params
    if (request.params) {
      this.sanitizeObject(request.params);
    }

    return next.handle();
  }

  private sanitizeObject(obj: any): void {
    if (!obj || typeof obj !== 'object') return;

    // Lista de campos perigosos que nunca devem ser aceitos
    const dangerousFields = ['__proto__', 'constructor', 'prototype'];

    for (const key in obj) {
      if (dangerousFields.includes(key)) {
        delete obj[key];
        continue;
      }

      const value = obj[key];

      // Sanitizar strings removendo caracteres perigosos
      if (typeof value === 'string') {
        // Remover scripts e tags HTML potencialmente perigosas
        obj[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
          .trim();
      }

      // Recursivamente sanitizar objetos aninhados
      if (typeof value === 'object' && value !== null) {
        this.sanitizeObject(value);
      }
    }
  }
}
