import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuditService } from "../../common/services/audit.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, AuditService, AuthGuard, RolesGuard],
  exports: [AuthService, AuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
