import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { HealthModule } from "../src/modules/health/health.module";

describe("Health API", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health returns ok", async () => {
    await request(app.getHttpServer()).get("/health").expect(200).expect(({ body }) => {
      expect(body.ok).toBe(true);
      expect(body.service).toBe("way-education-backend");
    });
  });
});
