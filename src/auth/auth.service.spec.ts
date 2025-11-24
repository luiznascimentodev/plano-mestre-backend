import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { AuditService } from '../audit/audit.service';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let refreshTokenService: RefreshTokenService;
  let tokenBlacklistService: TokenBlacklistService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockRefreshTokenService = {
    createRefreshToken: jest.fn(),
    validateRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn(),
    revokeAllUserTokens: jest.fn(),
    generateRefreshToken: jest.fn(),
  };

  const mockTokenBlacklistService = {
    addToBlacklist: jest.fn(),
    isBlacklisted: jest.fn(),
  };

  const mockAuditService = {
    log: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        JWT_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
        { provide: TokenBlacklistService, useValue: mockTokenBlacklistService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    tokenBlacklistService = module.get<TokenBlacklistService>(
      TokenBlacklistService,
    );

    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'StrongPassword123!',
      name: 'Test User',
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const createdUser = {
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        twoFactorSecret: null,
        twoFactorEnabled: false,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(registerDto.email);
      expect(result.name).toBe(registerDto.name);
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = {
        id: 1,
        email: registerDto.email,
        name: 'Existing User',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
        twoFactorSecret: null,
        twoFactorEnabled: false,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'StrongPassword123!',
    };

    it('should successfully login and return tokens', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const user = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        twoFactorSecret: null,
        twoFactorEnabled: false,
      };

      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValueOnce(accessToken);
      mockRefreshTokenService.generateRefreshToken.mockResolvedValue(
        refreshToken,
      );
      mockAuditService.log.mockResolvedValue(undefined);

      const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user).not.toHaveProperty('password');
      expect(mockRefreshTokenService.generateRefreshToken).toHaveBeenCalledWith(
        user.id,
      );
    });

    it('should throw UnauthorizedException if email not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockAuditService.log.mockResolvedValue(undefined);

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        password: await bcrypt.hash('different-password', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
        twoFactorSecret: null,
        twoFactorEnabled: false,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockAuditService.log.mockResolvedValue(undefined);

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should successfully logout user and blacklist token', async () => {
      const token = 'valid-token';
      const userId = 1;
      const decodedToken = { exp: Math.floor(Date.now() / 1000) + 3600 };

      mockJwtService.decode.mockReturnValue(decodedToken);
      mockTokenBlacklistService.addToBlacklist.mockResolvedValue(undefined);
      mockRefreshTokenService.revokeAllUserTokens.mockResolvedValue(undefined);

      await service.logout(token, userId, '127.0.0.1', 'test-agent');

      expect(mockTokenBlacklistService.addToBlacklist).toHaveBeenCalled();
      expect(mockRefreshTokenService.revokeAllUserTokens).toHaveBeenCalledWith(
        userId,
      );
    });
  });
});
