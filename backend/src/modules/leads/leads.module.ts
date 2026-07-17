import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AuditService } from "../../common/services/audit.service";
import { LeadsController } from "./leads.controller";
import { LeadsRepository } from "./leads.repository";
import { LeadsService } from "./leads.service";

@Module({
  imports: [AuthModule],
  controllers: [LeadsController],
  providers: [LeadsRepository, LeadsService, AuditService],
})
export class LeadsModule {}
