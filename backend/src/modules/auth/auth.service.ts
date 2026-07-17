import { randomUUID } from "node:crypto";
import { BadRequestException, Injectable, LockedException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { Response } from "express";
import { MailerService } from "../../common/mailer/mailer.service";
import { AuditService } from "../../common/services/audit.service";
import { AuthRepository } from "./auth.repository";
import { LoginDto, RequestPasswordResetDto, ResetPasswordDto, VerifyEmailDto } from "./dto/auth.dto";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  version: number;
  jti?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
    private readonly mailerService: MailerService
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.getOrThrow<string>("ADMIN_EMAIL");
    const adminPassword = this.configService.getOrThrow<string>("ADMIN_PASSWORD");
    const passwordHash = await argon2.hash(adminPassword);
    await this.authRepository.ensureInitialAdmin(adminEmail, passwordHash);
  }

  private parseDuration(value: string) {
    const match = String(value).trim().match(/^(\d+)([smhd])$/i);
    if (!match) {
      throw new Error(`Unsupported duration format: ${value}`);
    }
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers: Record<string, number> = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 };
    return amount * multipliers[unit];
  }

  private cookieOptions(maxAge: number) {
    const isProd = this.configService.get<string>("NODE_ENV") === "production";
    const domain = this.configService.getOrThrow<string>("COOKIE_DOMAIN");
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax" as const,
      path: "/",
      domain: domain === "localhost" ? undefined : domain,
      maxAge,
    };
  }

  private async writeSessionCookies(response: Response, user: { id: string; email: string; role: string; sessionVersion: number }, userAgent?: string, ipAddress?: string) {
    const accessTtl = this.configService.getOrThrow<string>("JWT_ACCESS_TTL");
    const refreshTtl = this.configService.getOrThrow<string>("JWT_REFRESH_TTL");
    const accessExpiresIn = accessTtl as `${number}${"s" | "m" | "h" | "d"}`;
    const refreshExpiresIn = refreshTtl as `${number}${"s" | "m" | "h" | "d"}`;
    const accessMaxAge = this.parseDuration(accessTtl);
    const refreshMaxAge = this.parseDuration(refreshTtl);
    const refreshJti = randomUUID();

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role, version: user.sessionVersion },
      {
        secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
        expiresIn: accessExpiresIn as any,
      }
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role, version: user.sessionVersion, jti: refreshJti },
      {
        secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
        expiresIn: refreshExpiresIn as any,
      }
    );

    await this.authRepository.createRefreshToken(
      user.id,
      await argon2.hash(refreshToken),
      new Date(Date.now() + refreshMaxAge),
      userAgent,
      ipAddress
    );

    response.cookie(ACCESS_COOKIE, accessToken, this.cookieOptions(accessMaxAge));
    response.cookie(REFRESH_COOKIE, refreshToken, this.cookieOptions(refreshMaxAge));
  }

  private clearSessionCookies(response: Response) {
    response.clearCookie(ACCESS_COOKIE, this.cookieOptions(0));
    response.clearCookie(REFRESH_COOKIE, this.cookieOptions(0));
  }

  private async verifyOpaqueToken<T extends { userId: string }>(token: string, candidates: Array<T & { id: string; tokenHash: string }>) {
    for (const candidate of candidates) {
      if (await argon2.verify(candidate.tokenHash, token)) {
        return candidate;
      }
    }
    return null;
  }

  async login(dto: LoginDto, response: Response, userAgent?: string, ipAddress?: string) {
    const user = await this.authRepository.findUserByEmail(dto.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new LockedException("Account temporarily locked due to repeated failed login attempts");
    }

    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) {
      const failedLoginAttempts = user.failedLoginAttempts + 1;
      const update: Record<string, unknown> = { failedLoginAttempts };
      if (failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        update.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000);
      }
      await this.authRepository.updateUser(user.id, update);
      await this.auditService.log({
        userId: user.id,
        action: "auth.login_failed",
        entityType: "user",
        entityId: user.id,
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException("Invalid credentials");
    }

    const updatedUser = await this.authRepository.updateUser(user.id, {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    });

    await this.writeSessionCookies(response, updatedUser, userAgent, ipAddress);
    await this.auditService.log({
      userId: updatedUser.id,
      action: "auth.login_success",
      entityType: "user",
      entityId: updatedUser.id,
      ipAddress,
      userAgent,
    });

    return {
      authenticated: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  }

  async refresh(refreshToken: string | undefined, response: Response, userAgent?: string, ipAddress?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token missing");
    }

    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.authRepository.findUserById(payload.sub);
    if (!user || user.sessionVersion !== payload.version) {
      throw new UnauthorizedException("Session revoked");
    }

    const candidates = await this.authRepository.findActiveRefreshTokens(user.id);
    const matched = await this.verifyOpaqueToken(refreshToken, candidates.map((entry) => ({ ...entry, userId: user.id })));
    if (!matched) {
      throw new UnauthorizedException("Refresh token not recognized");
    }

    await this.authRepository.revokeRefreshToken(matched.id);
    await this.writeSessionCookies(response, user, userAgent, ipAddress);
    await this.auditService.log({
      userId: user.id,
      action: "auth.refresh",
      entityType: "user",
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    return { ok: true };
  }

  async logout(userId: string | undefined, refreshToken: string | undefined, response: Response, userAgent?: string, ipAddress?: string) {
    this.clearSessionCookies(response);
    if (!userId || !refreshToken) {
      return { ok: true };
    }

    const candidates = await this.authRepository.findActiveRefreshTokens(userId);
    const matched = await this.verifyOpaqueToken(refreshToken, candidates.map((entry) => ({ ...entry, userId })));
    if (matched) {
      await this.authRepository.revokeRefreshToken(matched.id);
    }

    await this.auditService.log({
      userId,
      action: "auth.logout",
      entityType: "user",
      entityId: userId,
      ipAddress,
      userAgent,
    });
    return { ok: true };
  }

  async me(userId: string) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt,
      },
    };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto, ipAddress?: string, userAgent?: string) {
    const user = await this.authRepository.findUserByEmail(dto.email.toLowerCase());
    if (!user) {
      return { ok: true };
    }

    const token = randomUUID();
    await this.authRepository.createPasswordResetToken(user.id, await argon2.hash(token), new Date(Date.now() + 60 * 60_000));
    await this.mailerService.sendPasswordReset(user.email, token);
    await this.auditService.log({
      userId: user.id,
      action: "auth.password_reset_requested",
      entityType: "user",
      entityId: user.id,
      ipAddress,
      userAgent,
    });
    return { ok: true };
  }

  async resetPassword(dto: ResetPasswordDto, ipAddress?: string, userAgent?: string) {
    const tokens = await this.authRepository.findAllActivePasswordResetTokens();
    for (const token of tokens) {
      if (await argon2.verify(token.tokenHash, dto.token)) {
        const user = await this.authRepository.findUserById(token.userId);
        if (!user) {
          break;
        }
        await this.authRepository.usePasswordResetToken(token.id);
        await this.authRepository.revokeAllRefreshTokens(user.id);
        await this.authRepository.updateUser(user.id, {
          passwordHash: await argon2.hash(dto.password),
          sessionVersion: { increment: 1 },
          failedLoginAttempts: 0,
          lockedUntil: null,
        });
        await this.auditService.log({
          userId: user.id,
          action: "auth.password_reset_completed",
          entityType: "user",
          entityId: user.id,
          ipAddress,
          userAgent,
        });
        return { ok: true };
      }
    }
    throw new BadRequestException("Password reset token is invalid or expired");
  }

  async requestEmailVerification(userId: string, ipAddress?: string, userAgent?: string) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const token = randomUUID();
    await this.authRepository.createEmailVerificationToken(user.id, await argon2.hash(token), new Date(Date.now() + 24 * 60 * 60_000));
    await this.mailerService.sendEmailVerification(user.email, token);
    await this.auditService.log({
      userId: user.id,
      action: "auth.email_verification_requested",
      entityType: "user",
      entityId: user.id,
      ipAddress,
      userAgent,
    });
    return { ok: true };
  }

  async verifyEmail(userId: string, dto: VerifyEmailDto, ipAddress?: string, userAgent?: string) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const tokens = await this.authRepository.findActiveEmailVerificationTokens(user.id);
    for (const token of tokens) {
      if (await argon2.verify(token.tokenHash, dto.token)) {
        await this.authRepository.useEmailVerificationToken(token.id);
        await this.authRepository.updateUser(user.id, { emailVerifiedAt: new Date() });
        await this.auditService.log({
          userId: user.id,
          action: "auth.email_verified",
          entityType: "user",
          entityId: user.id,
          ipAddress,
          userAgent,
        });
        return { ok: true };
      }
    }
    throw new BadRequestException("Verification token is invalid or expired");
  }
}
