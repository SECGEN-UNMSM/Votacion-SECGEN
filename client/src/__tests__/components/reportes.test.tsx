import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { ReportesPDF } from "@/components/reportes";
import { useVotos } from "@/hooks/useVotos";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";

jest.mock("@/api/api", () => ({
  baseURL: jest.fn(() => "http://localhost:3000/api"),
}));

jest.mock("@tauri-apps/plugin-http", () => ({
  // Y que devuelva un objeto con una función 'fetch' falsa que podemos controlar.
  fetch: jest.fn(),
}));

jest.mock("@/hooks/useVotos");
const mockUseVotos = useVotos as jest.Mock;

jest.mock("@/components/conteo-votos/tabla-votos-candidatos", () => {
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

window.PointerEvent = createMockPointerEvent as unknown as typeof PointerEvent;

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

  describe("Construcción de URL para PDF", () => {
    it("Debería construir la URL correcta para reporte general", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: jest.fn().mockResolvedValue(new Blob()),
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      });
      jest.mocked(tauriFetch).mockImplementation(mockFetch);

      render(<ReportesPDF />);

      const botonDescarga = screen.getByRole("button", {
        name: /descargar pdf/i,
      });
      await user.click(botonDescarga);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/exportar-general-pdf/"
      );
    });

    it("Debería construir la URL correcta para reporte por categoría", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: jest.fn().mockResolvedValue(new Blob()),
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      });
      jest.mocked(tauriFetch).mockImplementation(mockFetch);

      render(<ReportesPDF />);

      const radioCategoria = screen.getByLabelText(/reporte por categoría/i);
      await user.click(radioCategoria);

      const selectTrigger = screen.getByRole("combobox");
      await user.click(selectTrigger);

      const opcionDecanos = await screen.findByText("Docentes Principales");
      await user.click(opcionDecanos);

      const botonDescarga = screen.getByRole("button", {
        name: /descargar pdf/i,
      });
      await user.click(botonDescarga);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/exportar-pdf/Docentes%20Principales"
      );
    });

    it("Debería codificar correctamente caracteres especiales en la URL", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: jest.fn().mockResolvedValue(new Blob()),
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      });
      jest.mocked(tauriFetch).mockImplementation(mockFetch);

      render(<ReportesPDF />);

      const radioCategoria = screen.getByLabelText(/reporte por categoría/i);
      await user.click(radioCategoria);

      const selectTrigger = screen.getByRole("combobox");
      await user.click(selectTrigger);

      const opcionAsociados = await screen.findByText("Docentes Asociados");
      await user.click(opcionAsociados);

      const botonDescarga = screen.getByRole("button", {
        name: /descargar pdf/i,
      });
      await user.click(botonDescarga);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/exportar-pdf/Docentes%20Asociados"
      );
    });
  });

  describe("Descarga de PDF", () => {
    it("Debería descargar el PDF correctamente para reporte general", async () => {
      const mockBlob = new Blob(["pdf content"], { type: "application/pdf" });
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: jest.fn().mockResolvedValue(mockBlob),
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      });
      jest.mocked(tauriFetch).mockImplementation(mockFetch);

      const createElementSpy = jest.spyOn(document, "createElement");
      const appendChildSpy = jest.spyOn(document.body, "appendChild");
      const removeChildSpy = jest.spyOn(document.body, "removeChild");

      render(<ReportesPDF />);

      const botonDescarga = screen.getByRole("button", {
        name: /descargar pdf/i,
      });
      await user.click(botonDescarga);

      // Esperar a que se complete la descarga
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockFetch).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith("a");
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it("Debería usar el nombre de archivo correcto para reporte por categoría", async () => {
      const mockBlob = new Blob(["pdf content"], { type: "application/pdf" });
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: jest.fn().mockResolvedValue(mockBlob),
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      });
      jest.mocked(tauriFetch).mockImplementation(mockFetch);

      let downloadLink: HTMLAnchorElement | null = null;
      const createElementSpy = jest
        .spyOn(document, "createElement")
        .mockImplementation((tagName: string) => {
          const element = document.createElement.bind(document)(tagName);
          if (tagName === "a") {
            downloadLink = element as HTMLAnchorElement;
          }
          return element;
        });

      render(<ReportesPDF />);

      const radioCategoria = screen.getByLabelText(/reporte por categoría/i);
      await user.click(radioCategoria);

      const selectTrigger = screen.getByRole("combobox");
      await user.click(selectTrigger);

      const opcionDecanos = await screen.findByText("Docentes Principales");
      await user.click(opcionDecanos);

      const botonDescarga = screen.getByRole("button", {
        name: /descargar pdf/i,
      });
      await user.click(botonDescarga);

      // Esperar a que se complete la descarga
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(downloadLink).not.toBeNull();
      expect(downloadLink?.download).toBe("reporte_Docentes_Principales.pdf");

      createElementSpy.mockRestore();
    });

    it("Debería manejar errores de red correctamente", async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error("Network error"));
      jest.mocked(tauriFetch).mockImplementation(mockFetch);

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<ReportesPDF />);

      const botonDescarga = screen.getByRole("button", {
        name: /descargar pdf/i,
      });
      await user.click(botonDescarga);

      // Esperar a que se complete el manejo del error
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error al descargar reporte:",
        expect.any(Error)
      );
      expect(
        screen.getByText(/Error al descargar el reporte: Network error/i)
      ).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("Debería manejar respuestas no exitosas del servidor", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValue("Internal Server Error"),
      });
      jest.mocked(tauriFetch).mockImplementation(mockFetch);

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<ReportesPDF />);

      const botonDescarga = screen.getByRole("button", {
        name: /descargar pdf/i,
      });
      await user.click(botonDescarga);

      // Esperar a que se complete el manejo del error
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(
        screen.getByText(
          /Error al descargar el reporte: Error del servidor: 500/i
        )
      ).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it("Debería mostrar el estado de carga mientras descarga", async () => {
      let resolveBlob: (value: Blob) => void;
      const blobPromise = new Promise<Blob>((resolve) => {
        resolveBlob = resolve;
      });

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        blob: jest.fn().mockReturnValue(blobPromise),
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      });
      jest.mocked(tauriFetch).mockImplementation(mockFetch);

      render(<ReportesPDF />);

      const botonDescarga = screen.getByRole("button", {
        name: /descargar pdf/i,
      });

      expect(botonDescarga).toBeEnabled();

      await user.click(botonDescarga);

      // El botón debería estar deshabilitado durante la descarga
      expect(botonDescarga).toBeDisabled();

      // Resolver la promesa del blob
      resolveBlob!(new Blob(["pdf content"], { type: "application/pdf" }));

      // Esperar a que se complete la descarga
      await new Promise((resolve) => setTimeout(resolve, 100));

      // El botón debería estar habilitado nuevamente
      expect(botonDescarga).toBeEnabled();
    });
  });
});
