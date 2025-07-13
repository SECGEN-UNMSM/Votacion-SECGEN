import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { ReportesPDF } from "@/components/reportes";
import { useVotos } from "@/hooks/useVotos";

jest.mock("@/api/api", () => ({
  baseURL: jest.fn(() => "http://localhost:3000/api"),
}));

jest.mock("@tauri-apps/plugin-http", () => ({
  // Y que devuelva un objeto con una función 'fetch' falsa que podemos controlar.
  fetch: jest.fn(),
}));

jest.mock("@/hooks/useVotos");
const mockUseVotos = useVotos as jest.Mock;

jest.mock("@/components/CardsRankingVotos/rankingVotos", () => {
  return function MockRankingVotos() {
    return <div data-testid="ranking-votos-mock">Ranking de Votos</div>;
  };
});

jest.mock("@/lib/types", () => ({
  listaCategorias: [
    "Docentes Principales",
    "Docentes Asociados",
    "Docentes Auxiliares",
    "Estudiantes",
  ],
}));

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

describe("Componente ReportesPDF", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();

    global.URL.createObjectURL = jest.fn(() => "mock-url");
    global.URL.revokeObjectURL = jest.fn();

    mockUseVotos.mockReturnValue({ loading: false });
  });

  it("Debería renderizar el componente en su estado inicial correctamente", () => {
    render(<ReportesPDF />);

    expect(screen.getByText(/configuración del reporte/i)).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /reporte general/i })
    ).toBeChecked();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /descargar pdf/i })
    ).toBeEnabled();
    expect(screen.getByTestId("ranking-votos-mock")).toBeInTheDocument();
  });

  it("Debería mostrar el icono de carga si los datos del ranking están cargando", () => {
    mockUseVotos.mockReturnValue({ loading: true });

    render(<ReportesPDF />);

    expect(screen.getByText(/cargando datos/i)).toBeInTheDocument();
    expect(screen.queryByTestId("ranking-votos-mock")).not.toBeInTheDocument();
  });

  it("Debería mostrar el select de categorías al cambiar a 'Reporte por Categoría'", async () => {
    render(<ReportesPDF />);

    const radioCategoria = screen.getByLabelText(/reporte por categoría/i);
    await user.click(radioCategoria);

    expect(radioCategoria).toBeChecked();
    expect(await screen.findByLabelText(/categoría/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /descargar pdf/i })
    ).toBeDisabled();
  });

  it("Debería habilitar el botón de descarga al seleccionar una categoría", async () => {
    render(<ReportesPDF />);

    const radioCategoria = screen.getByLabelText(/reporte por categoría/i);
    await user.click(radioCategoria);

    const botonDescarga = screen.getByRole("button", {
      name: /descargar pdf/i,
    });
    expect(botonDescarga).toBeDisabled();

    // Selección del componente select
    const selectTrigger = screen.getByRole("combobox");
    await user.click(selectTrigger);

    const opcionDecanos = await screen.findByText("Docentes Principales");
    await user.click(opcionDecanos);

    expect(botonDescarga).toBeEnabled();
    expect(selectTrigger).toHaveTextContent("Docentes Principales");
  });
});
