import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;

  const authService = {
    login: jest.fn().mockResolvedValue({
      authenticated: true,
      user: {
        id: "user_1",
        email: "admin@wayeducation.com",
        role: "SUPER_ADMIN",
      },
    }),
    requestPasswordReset: jest.fn().mockResolvedValue({ ok: true }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(authService as unknown as AuthService);
  });

  it("logs in with email/password", async () => {
    const result = await controller.login(
      { email: "admin@wayeducation.com", password: "secret123" },
      {} as any,
      { headers: { "user-agent": "jest" }, ip: "127.0.0.1" } as any,
    );
    expect(result.authenticated).toBe(true);
  });

  it("requests password reset", async () => {
    const result = await controller.requestPasswordReset(
      { email: "admin@wayeducation.com" },
      { headers: { "user-agent": "jest" }, ip: "127.0.0.1" } as any,
    );
    expect(result).toEqual({ ok: true });
  });
});
