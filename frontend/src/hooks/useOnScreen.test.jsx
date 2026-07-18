import React, { useRef } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { useOnScreen } from "./useOnScreen";

let observerCallback;

class MockIntersectionObserver {
  constructor(cb) {
    observerCallback = cb;
  }

  observe = vi.fn();

  disconnect = vi.fn();
}

function Probe() {
  const ref = useRef(null);
  const visible = useOnScreen(ref);

  return (
    <div>
      <div ref={ref}>target</div>
      <span data-testid="visible">{String(visible)}</span>
    </div>
  );
}

describe("useOnScreen", () => {
  beforeEach(() => {
    observerCallback = undefined;
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  it("becomes true when element intersects", async () => {
    render(<Probe />);

    expect(screen.getByTestId("visible")).toHaveTextContent("false");

    await waitFor(() => expect(observerCallback).toBeDefined());

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      expect(screen.getByTestId("visible")).toHaveTextContent("true");
    });
  });
});
