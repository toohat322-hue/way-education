import { CmsController } from "./cms.controller";
import { CmsService } from "./cms.service";

describe("CmsController", () => {
  let controller: CmsController;

  const cmsService = {
    getBootstrap: jest.fn().mockResolvedValue({ universities: [], directory: [], majors: [], faqs: [], settings: null, strings: {} }),
    listCountries: jest.fn().mockResolvedValue([]),
    listCities: jest.fn().mockResolvedValue([]),
    listSeoPages: jest.fn().mockResolvedValue([]),
    listBlogPosts: jest.fn().mockResolvedValue([]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CmsController(cmsService as unknown as CmsService);
  });

  it("returns bootstrap payload", async () => {
    const result = await controller.getBootstrap();
    expect(result.universities).toEqual([]);
  });

  it("returns countries", async () => {
    const result = await controller.getCountries();
    expect(result).toEqual([]);
  });
});
