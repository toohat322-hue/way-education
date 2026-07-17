import { Injectable } from "@nestjs/common";
import { LeadStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateLeadDto, LeadsQueryDto, UpdateLeadDto } from "./dto/leads.dto";

@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveCountryByName(name?: string) {
    if (!name) return null;
    return this.prisma.country.findFirst({ where: { OR: [{ nameEn: name }, { nameAr: name }] } });
  }

  private async resolveUniversityBySlugOrName(value?: string) {
    if (!value) return null;
    return this.prisma.university.findFirst({ where: { OR: [{ slug: value }, { name: value }] } });
  }

  async createLead(dto: CreateLeadDto, ipAddress?: string | null, userAgent?: string | null) {
    const [country, preferredCountry, preferredUniversity] = await Promise.all([
      this.resolveCountryByName(dto.country),
      this.resolveCountryByName(dto.preferredCountry),
      this.resolveUniversityBySlugOrName(dto.preferredUniversity),
    ]);

    return this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        email: dto.email,
        program: dto.program,
        degree: dto.degree,
        language: dto.language,
        message: dto.message,
        referralSource: dto.referralSource,
        utmSource: dto.utmSource,
        utmMedium: dto.utmMedium,
        utmCampaign: dto.utmCampaign,
        utmTerm: dto.utmTerm,
        utmContent: dto.utmContent,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        countryId: country?.id,
        preferredCountryId: preferredCountry?.id,
        preferredUniversityId: preferredUniversity?.id,
      },
      include: { preferredUniversity: true, assignedTo: true, notes: true, country: true, preferredCountry: true },
    });
  }

  async listLeads(query: LeadsQueryDto) {
    const where: Prisma.LeadWhereInput = {
      status: query.status ? (query.status as LeadStatus) : undefined,
      assignedToId: query.assignedToId,
      OR: query.search
        ? [
            { name: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
          ]
        : undefined,
    };
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const [items, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: { preferredUniversity: true, assignedTo: true, notes: { include: { user: true }, orderBy: { createdAt: "desc" } }, country: true, preferredCountry: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.lead.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  updateLead(id: string, dto: UpdateLeadDto) {
    return this.prisma.lead.update({
      where: { id },
      data: { status: dto.status, assignedToId: dto.assignedToId },
      include: { preferredUniversity: true, assignedTo: true, notes: { include: { user: true }, orderBy: { createdAt: "desc" } }, country: true, preferredCountry: true },
    });
  }

  addNote(leadId: string, userId: string, note: string, type: string) {
    return this.prisma.leadNote.create({
      data: { leadId, userId, note, type },
      include: { user: true },
    });
  }

  getStats() {
    return this.prisma.lead.groupBy({ by: ["status"], _count: { _all: true } });
  }
}
