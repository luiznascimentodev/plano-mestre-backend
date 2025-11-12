"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const cookieParser = require('cookie-parser');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    const missingVars = requiredEnvVars.filter((varName) => !configService.get(varName));
    if (missingVars.length > 0) {
        logger.error(`Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`);
        process.exit(1);
    }
    app.use(cookieParser());
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
    }));
    const allowedOrigins = configService
        .get('ALLOWED_ORIGINS', 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim());
    const isProduction = configService.get('NODE_ENV') === 'production';
    app.enableCors({
        origin: (origin, callback) => {
            if (!isProduction && (!origin || origin.includes('localhost'))) {
                callback(null, true);
                return;
            }
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        credentials: true,
        optionsSuccessStatus: 200,
    });
    if (!isProduction) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Plano Mestre API')
            .setDescription('Documentação da API da plataforma de estudos Plano Mestre.')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api-docs', app, document);
        logger.log('Swagger disponível em /api-docs (apenas em desenvolvimento)');
    }
    else {
        logger.warn('Swagger desabilitado em produção por segurança');
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        disableErrorMessages: isProduction,
    }));
    const port = configService.get('PORT', 3001);
    await app.listen(port);
    logger.log(`Backend rodando em http://localhost:${port}`);
    logger.log(`Ambiente: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map