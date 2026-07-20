import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import { LanguageProvider } from "./LanguageContext";
import { useLanguage } from "./useLanguage";

function Probe() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="title">{t.allUnisTitle}</span>
      <button onClick={toggleLang}>toggle</button>
    </div>
  );
}

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("dir", "ltr");
  });

  it("loads default English state", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("title")).toHaveTextContent("All Universities");
  });

  it("toggles language and persists to localStorage", async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByTestId("lang")).toHaveTextContent("ar");
    expect(localStorage.getItem("st_lang")).toBe("ar");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
  });
});
