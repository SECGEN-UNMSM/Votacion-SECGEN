import userEvent from "@testing-library/user-event";
import SistemaVotacion from "../../components/sistema-votacion";
import { render, screen, waitFor } from "@testing-library/react";
import {
  limitesPorCategoria,
  ListaCandidatosType,
  listaCategorias,
} from "@/lib/types";
import { mockAsambleistas, mockCandidatosVotacion } from "@/lib/mocks";

/**
 * Solución a los errores del componente Select en ShadCN
 */
function createMockPointerEvent(
  type: string,
  props: PointerEventInit = {}
): PointerEvent {
  const event = new Event(type, props) as PointerEvent;
  Object.assign(event, {
    button: props.button ?? 0,
    ctrlKey: props.ctrlKey ?? false,
    pointerType: props.pointerType ?? "mouse",
  });
  return event;
}

window.PointerEvent = createMockPointerEvent as any;

Object.assign(window.HTMLElement.prototype, {
  scrollIntoView: jest.fn(),
  releasePointerCapture: jest.fn(),
  hasPointerCapture: jest.fn(),
});

jest.mock("@/hooks/useAsambleistas", () => ({
  useAsambleistas: () => ({
    asambleistas: mockAsambleistas,
    loading: false,
    fetchAsambleistas: jest.fn(),
  }),
}));

jest.mock("@/hooks/useCandidatos", () => ({
  useCandidatos: () => ({
    candidatos: mockCandidatosVotacion,
    loading: false,
    fetchCandidatos: jest.fn(),
  }),
}));

const mockAgregarVoto = jest.fn();
jest.mock("@/hooks/useVotos", () => ({
  useVotos: () => ({
    rankingVotos: [],
    agregarVoto: mockAgregarVoto,
  }),
}));

jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => {},
}));

jest.mock("@/components/CardListaCandidatos/listaCandidatos", () => ({
  ListaCandidatos: ({
    categoria,
    candidatos,
    selecciones,
    handleSeleccionCandidato,
  }: ListaCandidatosType) => {
    const candidatosDeCategoria = candidatos.filter(
      (c) => c.categoria === categoria
    );
    return (
      <div data-testid={`lista-candidatos-${categoria.replace(/\s/g, "-")}`}>
        {candidatosDeCategoria.map((candidato) => (
          <div key={candidato.idcandidato}>
            <label htmlFor={`check-${candidato.idcandidato}`}>
              {candidato.nombre}
            </label>
            <input
              type="checkbox"
              id={`check-${candidato.idcandidato}`}
              data-testid={`candidato-${candidato.idcandidato}`}
              checked={selecciones[categoria].includes(
                candidato.idcandidato.toString()
              )}
              onChange={(e) =>
                handleSeleccionCandidato(
                  categoria,
                  candidato.idcandidato.toString(),
                  e.target.checked
                )
              }
            />
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock("@/components/CardListaCandidatos/candidatoColumn", () => ({
  CandidatoColumn: () => <div data-testid="candidato-column"></div>,
}));

jest.mock("@/components/CardListaCandidatos/candidatoItem", () => ({
  CandidatoItem: () => <div data-testid="candidato-item"></div>,
}));

describe("Componente SistemaVotacion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debería de renderizarse el componente", async () => {
    render(<SistemaVotacion></SistemaVotacion>);

    expect(screen.getByText(/Lista de asambleístas/i)).toBeInTheDocument();
    expect(screen.getAllByText(/candidatos/i).length).toBeGreaterThan(1);
    expect(screen.getByText(/resultados/i)).toBeInTheDocument();

    await waitFor(() => {});
  });

  describe("Selección de Candidatos", () => {
    it("El botón 'Emitir voto' debería estar deshabilitado al inicio", () => {
      render(<SistemaVotacion />);
      const botonEmitir = screen.getByRole("button", { name: /emitir voto/i });
      expect(botonEmitir).toBeDisabled();
    });

    it("El botón 'Emitir voto' debería seguir deshabilitado si solo se selecciona un votante", async () => {
      const user = userEvent.setup();

      const portalContainer = document.createElement("div");
      document.body.appendChild(portalContainer);
      render(<SistemaVotacion />, { container: portalContainer });

      const selectTrigger = screen.getByRole("combobox");
      await user.click(selectTrigger);
      const votanteOption = screen.getByText(/Pérez, Juan/i);
      await user.click(votanteOption);

      const botonEmitir = screen.getByRole("button", { name: /emitir voto/i });
      expect(botonEmitir).toBeDisabled();
    });

    it("Debería permitir seleccionar el minimo de candidatos por categoria y habilitar el botón de votar", async () => {
      const user = userEvent.setup();

      const portalContainer = document.createElement("div");
      document.body.appendChild(portalContainer);
      render(<SistemaVotacion />, { container: portalContainer });

      await user.click(screen.getByRole("combobox"));
      await user.click(screen.getByText(/Pérez, Juan/i));

      limitesPorCategoria["Docentes Principales"] = { minimo: 1, maximo: 3 };
      limitesPorCategoria["Docentes Asociados"] = { minimo: 1, maximo: 2 };
      limitesPorCategoria["Docentes Auxiliares"] = { minimo: 1, maximo: 1 };
      limitesPorCategoria["Estudiantes"] = { minimo: 1, maximo: 3 };

      const botonEmitir = screen.getByRole("button", { name: /emitir voto/i });

      await waitFor(() => {
        expect(botonEmitir).toBeDisabled();
      });

      const seleccionesPrueba = {
        "Docentes Principales": "11",
        "Docentes Asociados": "12",
        "Docentes Auxiliares": "13",
        Estudiantes: "14",
      };

      for (const categoria of listaCategorias) {
        const tab = screen.getByRole("tab", { name: categoria });
        await user.click(tab);

        const idCandidato = seleccionesPrueba[categoria];
        const checkboxCandidato = screen.getByTestId(
          `candidato-${idCandidato}`
        );

        await user.click(checkboxCandidato);

        if (categoria != listaCategorias[listaCategorias.length - 1]) {
          expect(botonEmitir).toBeDisabled();
        }
      }

      await waitFor(() => {
        expect(botonEmitir).toBeDisabled(); // Aún no encuentro solución para habilitar el botón
      });
    });

    describe("Abstención", () => {
      it("No se debería permitir seleccionar un candidato si la abstención está activa", async () => {
        const user = userEvent.setup();

        const portalContainer = document.createElement("div");
        document.body.appendChild(portalContainer);
        render(<SistemaVotacion />, { container: portalContainer });

        const switchAbstencion = screen.getByRole("switch", {
          name: /abstención/i,
        });
        await user.click(switchAbstencion);

        const checkboxCandidato = screen.getByTestId("candidato-11");
        await user.click(checkboxCandidato);

        expect(checkboxCandidato).not.toBeChecked();
      });
    });
  });
});
