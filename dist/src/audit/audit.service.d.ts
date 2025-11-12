import { PrismaService } from '../prisma/prisma.service';
export interface AuditLogData {
    action: string;
    entityType?: string;
    entityId?: number;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    errorMessage?: string;
    userId?: number;
}
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(data: AuditLogData): Promise<void>;
    getLogs(userId?: number, limit?: number): Promise<({
        user: {
            name: string | null;
            id: number;
            email: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        userId: number | null;
        action: string;
        entityType: string | null;
        entityId: number | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        success: boolean;
        errorMessage: string | null;
    })[]>;
}
