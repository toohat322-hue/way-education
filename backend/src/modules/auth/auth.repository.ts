import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date, userAgent?: string | null, ipAddress?: string | null) {
    return this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt, userAgent: userAgent ?? null, ipAddress: ipAddress ?? null },
    });
  }

  findActiveRefreshTokens(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  }

  revokeRefreshToken(id: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  revokeAllRefreshTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
    return this.prisma.passwordResetToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  findActivePasswordResetTokens(userId: string) {
    return this.prisma.passwordResetToken.findMany({
      where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  }

  findAllActivePasswordResetTokens() {
    return this.prisma.passwordResetToken.findMany({
      where: { usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  }

  usePasswordResetToken(id: string) {
    return this.prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
  }

  createEmailVerificationToken(userId: string, tokenHash: string, expiresAt: Date) {
    return this.prisma.emailVerificationToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  findActiveEmailVerificationTokens(userId: string) {
    return this.prisma.emailVerificationToken.findMany({
      where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  }

  useEmailVerificationToken(id: string) {
    return this.prisma.emailVerificationToken.update({ where: { id }, data: { usedAt: new Date() } });
  }

  async ensureInitialAdmin(email: string, passwordHash: string): Promise<User> {
    const existing = await this.findUserByEmail(email);
    if (existing) return existing;
    return this.createUser({
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      permissions: ["*"] as unknown as Prisma.InputJsonValue,
    });
  }
}
