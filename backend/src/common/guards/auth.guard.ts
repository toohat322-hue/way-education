import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  version: number;
};

function readBearerToken(header?: string) {
  if (!header) return null;
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.accessToken || readBearerToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException("Authentication required");
    }

    let payload: AccessTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, sessionVersion: true, lockedUntil: true },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException("Account is temporarily locked");
    }
    if (user.sessionVersion !== payload.version) {
      throw new UnauthorizedException("Session revoked");
    }

    request.currentUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionVersion: user.sessionVersion,
    };
    return true;
  }
}
