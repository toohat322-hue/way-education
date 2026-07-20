import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext";
import { DataProvider } from "../admin/DataContext";

export function renderWithProviders(ui, { route = "/" } = {}) {
  return render(
    <DataProvider>
      <LanguageProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </LanguageProvider>
    </DataProvider>,
  );
}
