import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Gerenciamento de conexão com banco de dados
 *
 * SOLID Principles aplicados:
 * - Single Responsibility (SRP): Responsável APENAS pela conexão com DB
 * - Dependency Inversion (DIP): Depende da abstração PrismaClient, não de implementação concreta
 *
 * Connection Pooling:
 * - Configurado via DATABASE_URL (?connection_limit=5)
 * - Importante para RDS Free Tier (db.t2.micro suporta ~25 conexões)
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const isProduction = configService.get('NODE_ENV') === 'production';

    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      // Logs: apenas erros em produção, tudo em desenvolvimento
      log: isProduction
        ? ['error', 'warn']
        : ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Conectado ao banco de dados com sucesso');
    } catch (error) {
      this.logger.error('❌ Erro ao conectar ao banco de dados:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('🔌 Desconectado do banco de dados');
    } catch (error) {
      this.logger.error('❌ Erro ao desconectar do banco de dados:', error);
    }
  }
}
