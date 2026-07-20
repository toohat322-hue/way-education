import { LeadsController } from "./leads.controller";
import { LeadsService } from "./leads.service";

describe("LeadsController", () => {
  let controller: LeadsController;

  const leadsService = {
    createLead: jest.fn().mockResolvedValue({ ok: true, leadId: "lead_123" }),
    listLeads: jest
      .fn()
      .mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 20 }),
    getStats: jest.fn().mockResolvedValue({ NEW: 4 }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new LeadsController(leadsService as unknown as LeadsService);
  });

  it("creates a lead", async () => {
    const result = await controller.createLead(
      { name: "John", phone: "+90555111", email: "john@example.com" },
      { ip: "127.0.0.1", headers: { "user-agent": "jest" } } as any,
    );
    expect(result).toEqual({ ok: true, leadId: "lead_123" });
  });

  it("lists leads", async () => {
    const result = await controller.listLeads({ page: 1, pageSize: 20 });
    expect(result.total).toBe(0);
  });
});
