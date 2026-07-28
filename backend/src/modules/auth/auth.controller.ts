import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { AuthService } from "./auth.service";
import {
  LoginDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(200)
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.login(
      dto,
      response,
      request.headers["user-agent"],
      request.ip,
    );
  }

  @Post("refresh")
  @HttpCode(200)
  refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.refresh(
      request.cookies?.refreshToken,
      response,
      request.headers["user-agent"],
      request.ip,
    );
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@CurrentUser() currentUser: { id: string }) {
    return this.authService.me(currentUser.id);
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  @HttpCode(200)
  logout(
    @CurrentUser() currentUser: { id: string },
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.logout(
      currentUser.id,
      request.cookies?.refreshToken,
      response,
      request.headers["user-agent"],
      request.ip,
    );
  }

  @Post("password-reset/request")
  @Throttle({ default: { limit: 3, ttl: 15 * 60_000 } })
  @HttpCode(200)
  requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
    @Req() request: Request,
  ) {
    return this.authService.requestPasswordReset(
      dto,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @Post("password-reset/reset")
  @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } })
  @HttpCode(200)
  resetPassword(@Body() dto: ResetPasswordDto, @Req() request: Request) {
    return this.authService.resetPassword(
      dto,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @Post("email-verification/request")
  @UseGuards(AuthGuard)
  @HttpCode(200)
  requestEmailVerification(
    @CurrentUser() currentUser: { id: string },
    @Req() request: Request,
  ) {
    return this.authService.requestEmailVerification(
      currentUser.id,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @Post("email-verification/verify")
  @UseGuards(AuthGuard)
  @HttpCode(200)
  verifyEmail(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: VerifyEmailDto,
    @Req() request: Request,
  ) {
    return this.authService.verifyEmail(
      currentUser.id,
      dto,
      request.ip,
      request.headers["user-agent"],
    );
  }
}
