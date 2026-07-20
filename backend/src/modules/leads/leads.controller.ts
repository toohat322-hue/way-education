import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import {
  CreateLeadDto,
  CreateLeadNoteDto,
  LeadsQueryDto,
  UpdateLeadDto,
} from "./dto/leads.dto";
import { LeadsService } from "./leads.service";

@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  createLead(@Body() dto: CreateLeadDto, @Req() request: Request) {
    return this.leadsService.createLead(
      dto,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "STAFF")
  listLeads(@Query() query: LeadsQueryDto) {
    return this.leadsService.listLeads(query);
  }

  @Patch(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "STAFF")
  updateLead(
    @Param("id") id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.leadsService.updateLead(
      id,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @Post(":id/notes")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "STAFF")
  addNote(
    @Param("id") id: string,
    @Body() dto: CreateLeadNoteDto,
    @CurrentUser() user: any,
    @Req() request: Request,
  ) {
    return this.leadsService.addNote(
      id,
      dto,
      user,
      request.ip,
      request.headers["user-agent"],
    );
  }

  @Get("stats/summary")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN", "STAFF")
  getStats() {
    return this.leadsService.getStats();
  }

  @Get("export/csv")
  @Header("Content-Type", "text/csv")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("SUPER_ADMIN", "ADMIN")
  async exportCsv(
    @Query() query: LeadsQueryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader(
      "Content-Disposition",
      'attachment; filename="leads.csv"',
    );
    return this.leadsService.exportCsv(query);
  }
}
