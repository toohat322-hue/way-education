import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LeadForm from "./LeadForm";
import { STRINGS } from "../data/translations";
import { DataProvider } from "../admin/DataContext";

describe("LeadForm", () => {
  it("submits and shows success message", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    const t = STRINGS.en;

    render(
      <MemoryRouter>
        <DataProvider>
          <LeadForm t={t} onSubmitted={onSubmitted} majors={["Medicine"]} />
        </DataProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(t.sidebarName), "John Doe");
    await user.type(screen.getByLabelText(t.sidebarPhone), "+905551112233");
    await user.type(screen.getByLabelText(t.sidebarEmail), "john@example.com");
    await user.selectOptions(screen.getByLabelText(t.sidebarMajorSel), "Medicine");
    await user.click(screen.getByRole("button", { name: t.sidebarSubmit }));

    expect(onSubmitted).toHaveBeenCalledWith({
      name: "John Doe",
      phone: "+905551112233",
      email: "john@example.com",
      major: "Medicine",
    });
    expect(screen.getByText(t.formSuccess)).toBeInTheDocument();
  });
});
