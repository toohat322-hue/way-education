import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getHealth() {
    let dbStatus = "up";
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = "down";
    }
    return {
      ok: dbStatus === "up",
      service: "way-education-backend",
      database: dbStatus,
      timestamp: new Date().toISOString(),
    };
  }

  @Get("live")
  getLive() {
    return { ok: true };
  }

  @Get("ready")
  async getReady() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { ok: true, db: "connected" };
    } catch {
      throw new ServiceUnavailableException({
        ok: false,
        db: "disconnected",
      });
    }
  }
}
