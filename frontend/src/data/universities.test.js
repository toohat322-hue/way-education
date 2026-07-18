import { describe, expect, it } from "vitest";
import { UNIVERSITIES, getUniversityById } from "./universities";

describe("universities data", () => {
  it("returns matching university by id", () => {
    const id = UNIVERSITIES[0].id;
    expect(getUniversityById(id)?.id).toBe(id);
  });

  it("returns undefined for missing id", () => {
    expect(getUniversityById("missing-id")).toBeUndefined();
  });
});
