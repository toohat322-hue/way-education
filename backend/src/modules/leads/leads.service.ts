import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditService } from "../../common/services/audit.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CreateLeadDto, CreateLeadNoteDto, LeadsQueryDto, UpdateLeadDto } from "./dto/leads.dto";
import { LeadsRepository } from "./leads.repository";

import { ConfigService } from "@nestjs/config";
import { MailerService } from "../../common/mailer/mailer.service";

@Injectable()
export class LeadsService {
  constructor(
    private readonly repository: LeadsRepository,
    private readonly auditService: AuditService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  private serializeLead(lead: any) {
    return {
      id: lead.id,
      status: lead.status,
      name: lead.name,
      phone: lead.phone,
      whatsapp: lead.whatsapp,
      email: lead.email,
      country: lead.country?.nameEn,
      preferredCountry: lead.preferredCountry?.nameEn,
      preferredUniversity: lead.preferredUniversity?.name,
      program: lead.program,
      degree: lead.degree,
      language: lead.language,
      message: lead.message,
      referralSource: lead.referralSource,
      utm: {
        source: lead.utmSource,
        medium: lead.utmMedium,
        campaign: lead.utmCampaign,
        term: lead.utmTerm,
        content: lead.utmContent,
      },
      ipAddress: lead.ipAddress,
      userAgent: lead.userAgent,
      assignedTo: lead.assignedTo ? { id: lead.assignedTo.id, email: lead.assignedTo.email, role: lead.assignedTo.role } : null,
      notes: (lead.notes || []).map((note: any) => ({ id: note.id, note: note.note, type: note.type, createdAt: note.createdAt, user: note.user ? { id: note.user.id, email: note.user.email } : null })),
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }

  async createLead(dto: CreateLeadDto, ipAddress?: string | null, userAgent?: string | null) {
    const lead = await this.repository.createLead(dto, ipAddress, userAgent);
    await this.auditService.log({ action: "lead.created", entityType: "lead", entityId: lead.id, ipAddress, userAgent, meta: { email: lead.email } });
    
    // Dispatch email notification asynchronously
    const adminEmail = this.configService.get<string>("ADMIN_EMAIL");
    if (adminEmail) {
      this.mailerService.sendNewApplicationAlert(adminEmail, lead).catch(() => {});
    }

    return { ok: true, leadId: lead.id };
  }

  async listLeads(query: LeadsQueryDto) {
    const result = await this.repository.listLeads(query);
    return {
      ...result,
      items: result.items.map((lead) => this.serializeLead(lead)),
    };
  }

  async updateLead(id: string, dto: UpdateLeadDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const existing = await this.repository.findLeadById(id);
    if (!existing) throw new NotFoundException(`Lead with id "${id}" not found`);
    const lead = await this.repository.updateLead(id, dto);
    await this.auditService.log({ userId: currentUser.id, action: "lead.updated", entityType: "lead", entityId: lead.id, ipAddress, userAgent, meta: dto as unknown as Record<string, unknown> });
    return this.serializeLead(lead);
  }

  async addNote(leadId: string, dto: CreateLeadNoteDto, currentUser: AuthenticatedUser, ipAddress?: string, userAgent?: string) {
    const existing = await this.repository.findLeadById(leadId);
    if (!existing) throw new NotFoundException(`Lead with id "${leadId}" not found`);
    const note = await this.repository.addNote(leadId, currentUser.id, dto.note, dto.type || "note");
    await this.auditService.log({ userId: currentUser.id, action: "lead.note_added", entityType: "lead", entityId: leadId, ipAddress, userAgent });
    return { id: note.id, note: note.note, type: note.type, createdAt: note.createdAt, user: note.user ? { id: note.user.id, email: note.user.email } : null };
  }

  async getStats() {
    const stats = await this.repository.getStats();
    return stats.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = item._count._all;
      return acc;
    }, {});
  }

  async exportCsv(query: LeadsQueryDto) {
    const result = await this.repository.listLeads({ ...query, page: 1, pageSize: 5000 });
    const header = ["id", "status", "name", "phone", "whatsapp", "email", "country", "preferredCountry", "preferredUniversity", "program", "degree", "language", "message", "referralSource", "utmSource", "utmMedium", "utmCampaign", "createdAt"];
    const lines = result.items.map((lead) => [
      lead.id,
      lead.status,
      lead.name,
      lead.phone,
      lead.whatsapp || "",
      lead.email,
      lead.country?.nameEn || "",
      lead.preferredCountry?.nameEn || "",
      lead.preferredUniversity?.name || "",
      lead.program || "",
      lead.degree || "",
      lead.language || "",
      (lead.message || "").replace(/\r?\n/g, " "),
      lead.referralSource || "",
      lead.utmSource || "",
      lead.utmMedium || "",
      lead.utmCampaign || "",
      lead.createdAt.toISOString(),
    ]);
    return [header, ...lines].map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  }
}
