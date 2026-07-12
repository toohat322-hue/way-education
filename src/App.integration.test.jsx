import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

function renderAt(route) {
  window.history.pushState({}, "", route);
  return render(<App />);
}

describe("App routing integration", () => {
  it("renders home content on root route", () => {
    renderAt("/");
    expect(screen.getAllByText(/Way Education/i).length).toBeGreaterThan(0);
  });

  it("renders not found page for unknown route", () => {
    renderAt("/this-page-does-not-exist");
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });
});
