import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AuditService } from "../../common/services/audit.service";
import { CmsController } from "./cms.controller";
import { CmsRepository } from "./cms.repository";
import { CmsService } from "./cms.service";

@Module({
  imports: [AuthModule],
  controllers: [CmsController],
  providers: [CmsRepository, CmsService, AuditService],
  exports: [CmsService],
})
export class CmsModule {}
