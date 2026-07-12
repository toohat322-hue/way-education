import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { useCountUp } from "./useCountUp";

let now = 0;
let rafCallback;

function Probe({ target = 100, duration = 1000, active = true }) {
  const value = useCountUp(target, duration, active);
  return <span data-testid="value">{value}</span>;
}

describe("useCountUp", () => {
  beforeEach(() => {
    now = 0;
    rafCallback = undefined;
    vi.stubGlobal("requestAnimationFrame", (cb) => {
      rafCallback = cb;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  it("counts up to target value", async () => {
    render(<Probe target={10} duration={100} />);

    expect(screen.getByTestId("value")).toHaveTextContent("0");

    await waitFor(() => {
      expect(typeof rafCallback).toBe("function");
    });

    act(() => {
      rafCallback(now);
    });

    act(() => {
      now = 100;
      rafCallback(now);
    });

    await waitFor(() => {
      expect(screen.getByTestId("value")).toHaveTextContent("10");
    });
  });

  it("stays at 0 when inactive", () => {
    render(<Probe target={10} duration={100} active={false} />);
    expect(screen.getByTestId("value")).toHaveTextContent("0");
  });
});
