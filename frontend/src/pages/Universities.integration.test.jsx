import React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Universities from "./Universities";
import { renderWithProviders } from "../test/renderWithProviders";

describe("Universities page integration", () => {
  it("opens request info modal from directory card", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Universities />, { route: "/universities" });

    const requestButtons = screen.getAllByRole("button", {
      name: /request info/i,
    });
    await user.click(requestButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("filters by type", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Universities />, { route: "/universities" });

    const typeSelect = screen.getByLabelText(/public|private|حكومية|خاصة/i);
    await user.selectOptions(typeSelect, "Public");

    expect(screen.getAllByText(/Public|حكومية/i).length).toBeGreaterThan(0);
  });
});
