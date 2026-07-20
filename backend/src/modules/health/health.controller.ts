import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      ok: true,
      service: "way-education-backend",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("live")
  getLive() {
    return { ok: true };
  }

  @Get("ready")
  getReady() {
    return { ok: true };
  }
}
