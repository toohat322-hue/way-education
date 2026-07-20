import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";

/**
 * Lightweight CSRF protection guard for cookie-based authentication.
 *
 * Validates that mutating requests (POST, PUT, PATCH, DELETE) include
 * the `X-Requested-With` header. Browsers never send custom headers on
 * cross-origin form submissions or simple requests, so this effectively
 * blocks CSRF attacks without requiring token management.
 *
 * Combined with SameSite=Lax cookies, this provides strong CSRF defense
 * suitable for SPAs.
 *
 * GET/HEAD/OPTIONS requests are always allowed through (safe methods).
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  private static readonly SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Safe methods don't need CSRF protection
    if (CsrfGuard.SAFE_METHODS.has(request.method)) {
      return true;
    }

    // Mutating requests must include the custom header
    const header = request.headers["x-requested-with"];
    if (!header) {
      throw new ForbiddenException(
        "Missing X-Requested-With header. This request was blocked by CSRF protection.",
      );
    }

    return true;
  }
}
