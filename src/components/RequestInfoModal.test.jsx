import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RequestInfoModal from "./RequestInfoModal";
import { STRINGS } from "../data/translations";

describe("RequestInfoModal", () => {
  const uni = {
    name: "Demo University",
    city: "Istanbul",
    country: "Türkiye",
    type: "Private",
  };

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<RequestInfoModal uni={uni} t={STRINGS.en} onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
