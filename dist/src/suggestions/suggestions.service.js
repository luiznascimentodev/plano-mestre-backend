"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const nodemailer = __importStar(require("nodemailer"));
let SuggestionsService = class SuggestionsService {
    prisma;
    configService;
    transporter = null;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        const emailUser = this.configService.get('EMAIL_USER') || 'luiznascdev@gmail.com';
        const emailPassword = this.configService.get('EMAIL_PASSWORD') || '';
        if (emailPassword) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailUser,
                    pass: emailPassword,
                },
            });
        }
    }
    async create(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        const recipientEmail = this.configService.get('SUGGESTIONS_EMAIL') ||
            'luiznascdev@gmail.com';
        const emailUser = this.configService.get('EMAIL_USER') || 'luiznascdev@gmail.com';
        const mailOptions = {
            from: emailUser,
            to: recipientEmail,
            subject: `[Plano Mestre] Sugestão: ${dto.subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            Nova Sugestão - Plano Mestre
          </h2>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Informações do Usuário</h3>
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>ID do Usuário:</strong> ${user.id}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Assunto</h3>
            <p style="color: #475569; font-size: 16px;">${dto.subject}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Mensagem</h3>
            <p style="color: #475569; font-size: 16px; white-space: pre-wrap;">${dto.message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
            <p>Esta sugestão foi enviada através do sistema Plano Mestre.</p>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      `,
            text: `
Nova Sugestão - Plano Mestre

Informações do Usuário:
- Nome: ${user.name}
- Email: ${user.email}
- ID: ${user.id}

Assunto: ${dto.subject}

Mensagem:
${dto.message}

---
Enviado em: ${new Date().toLocaleString('pt-BR')}
      `,
        };
        try {
            if (this.transporter) {
                await this.transporter.sendMail(mailOptions);
                return {
                    success: true,
                    message: 'Sugestão enviada com sucesso!',
                };
            }
            else {
                console.log('Sugestão recebida (email não configurado):', {
                    user: user.name,
                    email: user.email,
                    subject: dto.subject,
                    message: dto.message,
                });
                return {
                    success: true,
                    message: 'Sugestão recebida! Obrigado pelo feedback.',
                    warning: 'Email não configurado. Configure EMAIL_USER e EMAIL_PASSWORD no .env',
                };
            }
        }
        catch (error) {
            console.error('Erro ao enviar email:', error);
            return {
                success: true,
                message: 'Sugestão recebida! Obrigado pelo feedback.',
                warning: 'Houve um problema ao enviar o email, mas sua sugestão foi registrada.',
            };
        }
    }
};
exports.SuggestionsService = SuggestionsService;
exports.SuggestionsService = SuggestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SuggestionsService);
//# sourceMappingURL=suggestions.service.js.map