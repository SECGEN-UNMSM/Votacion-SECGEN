import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import ReportesPage from "../../app/reportes/page";
import { VotosProvider } from "@/context/VotosContext";
import { AsambleistaProvider } from "@/context/AsambleistasContext";
import { CandidatoProvider } from "@/context/CandidatosContext";

/*Llamadas a API's */

jest.mock("@/api/apiVotos", () => ({
  getRankings: jest.fn().mockResolvedValue([]),
  registrarVotos: jest.fn(),
}));

jest.mock("@/api/apiCandidato", () => ({
  getCandidatos: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/api/apiAsambleista", () => ({
  getAsambleistas: jest.fn().mockResolvedValue([]),
}));

/*Hooks */

jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => {},
}));

jest.mock("@/hooks/useAsambleistas", () => ({
  useAsambleistas: () => ({
    fetchAsambleistas: jest.fn(),
  }),
}));

jest.mock("@/hooks/useCandidatos", () => ({
  useCandidatos: () => ({
    fetchCandidatos: jest.fn(),
  }),
}));

/*Componentes */
jest.mock("@/components/ToggleDarkMode", () => ({
  ToggleDarkMode: () => <div data-testid="toggle-dark-mode" />,
}));

describe("ReportPage", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "auth-token") return "fake-token";
      return null;
    });
  });

  it("Debería de renderizar la página de reportes", async () => {
    render(
      <AsambleistaProvider>
        <CandidatoProvider>
          <VotosProvider>
            <ReportesPage></ReportesPage>
          </VotosProvider>
        </CandidatoProvider>
      </AsambleistaProvider>
    );

    expect(
      screen.getByRole("heading", { name: /reportes del proceso de votación/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ir a inicio/i })
    ).toBeInTheDocument();

    await waitFor(() => {}); // Espera a que se termine de ejcutar el useEffect
  });
});
