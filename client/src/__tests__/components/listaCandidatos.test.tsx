import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ListaCandidatos } from "@/components/CardListaCandidatos/listaCandidatos";
import { CandidatoColumn } from "@/components/CardListaCandidatos/candidatoColumn";
import { ListaCandidatosType } from "@/lib/types";
import { mockRankingPrueba, mockCandidatosPrueba } from "@/lib/mocks";
import * as utils from "@/lib/utils";

const mockCandidatoColumn = CandidatoColumn as jest.Mock;
const mockGetCandidatosPorCategoria =
  utils.getCandidatosPorCategoria as jest.Mock;

jest.mock("@/components/CardListaCandidatos/candidatoColumn", () => ({
  CandidatoColumn: jest.fn(({ candidatos }) => (
    <div data-testid="candidato-column-mock">
      <span>{candidatos.length} candidatos</span>
    </div>
  )),
}));

jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area-mock">{children}</div>
  ),
}));

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  LoaderCircle: () => <div data-testid="loader-mock" />,
}));

jest.mock("@/lib/utils", () => ({
  getCandidatosPorCategoria: jest.fn(),
}));

const mockHandleSeleccion = jest.fn();

const baseProps: ListaCandidatosType = {
  categoria: "Docentes Principales",
  loadingCandidato: false,
  candidatos: mockCandidatosPrueba,
  rankingVotos: mockRankingPrueba,
  abstenciones: {
    "Docentes Principales": false,
    "Docentes Asociados": false,
    "Docentes Auxiliares": false,
    Estudiantes: false,
  },
  selecciones: {
    "Docentes Principales": ["1"],
    "Docentes Asociados": ["1"],
    "Docentes Auxiliares": ["1"],
    Estudiantes: ["1"],
  },
  limitesPorCategoria: {
    "Docentes Principales": { minimo: 1, maximo: 3 },
    "Docentes Asociados": { minimo: 1, maximo: 2 },
    "Docentes Auxiliares": { minimo: 1, maximo: 1 },
    Estudiantes: { minimo: 1, maximo: 3 },
  },
  handleSeleccionCandidato: mockHandleSeleccion,
};

describe("ListaCandidatos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debería mostrar el loader cuando loadingCandidato es true", () => {
    mockGetCandidatosPorCategoria.mockReturnValue([]);

    render(<ListaCandidatos {...baseProps} loadingCandidato={true} />);

    expect(screen.getByTestId("loader-mock")).toBeInTheDocument();
    expect(screen.getByText("Cargando datos...")).toBeInTheDocument();
    expect(
      screen.queryByTestId("candidato-column-mock")
    ).not.toBeInTheDocument();
  });

  it("Debería mostrar un mensaje cuando la lista de candidatos está vacía", () => {
    render(<ListaCandidatos {...baseProps} candidatos={[]} />);

    expect(screen.getByText("No hay candidatos")).toBeInTheDocument();
    expect(screen.queryByTestId("loader-mock")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("candidato-column-mock")
    ).not.toBeInTheDocument();
  });

  it("Debería dividir los candidatos en 4 columnas y pasarlos a CandidatoColumn", () => {
    mockGetCandidatosPorCategoria.mockReturnValue(
      [...mockCandidatosPrueba].sort((a, b) =>
        a.codigo_facultad.localeCompare(b.codigo_facultad)
      )
    );
    render(<ListaCandidatos {...baseProps} />);

    const columnas = screen.getAllByTestId("candidato-column-mock");
    expect(columnas).toHaveLength(4);

    expect(columnas[0]).toHaveTextContent("2 candidatos");
    expect(columnas[1]).toHaveTextContent("1 candidatos");
    expect(columnas[2]).toHaveTextContent("1 candidatos");
    expect(columnas[3]).toHaveTextContent("1 candidatos");
  });

  it("Debería pasar las props correctas a cada CandidatoColumn", () => {
    render(<ListaCandidatos {...baseProps} />);

    expect(mockCandidatoColumn).toHaveBeenCalledTimes(4);

    const primeraColumnaProps = mockCandidatoColumn.mock.calls[0][0];

    expect(primeraColumnaProps.seleccionesCategoria).toEqual(
      baseProps.selecciones["Docentes Principales"]
    );
    expect(primeraColumnaProps.limiteMaximo).toBe(
      baseProps.limitesPorCategoria["Docentes Principales"].maximo
    );
    expect(primeraColumnaProps.isDisabled).toBe(false);
    expect(typeof primeraColumnaProps.onSelectionChange).toBe("function");
  });

  it("Debería deshabilitar las columnas si la categoría está en estado de abstención", () => {
    render(
      <ListaCandidatos
        {...baseProps}
        abstenciones={{
          "Docentes Principales": true,
          "Docentes Asociados": false,
          "Docentes Auxiliares": false,
          Estudiantes: false,
        }}
      />
    );

    const primeraColumnaProps = mockCandidatoColumn.mock.calls[0][0];
    expect(primeraColumnaProps.isDisabled).toBe(true);

    const gridContainer = screen.getByTestId("scroll-area-mock").firstChild;
    expect(gridContainer).toHaveClass("opacity-50 pointer-events-none");
  });

  it("Debería llamar a handleSeleccionCandidato con los parametros correctos cuando onSelectionChange se ejecuta", () => {
    render(<ListaCandidatos {...baseProps} />);

    const onSelectionChangeFunc =
      mockCandidatoColumn.mock.calls[0][0].onSelectionChange;

    const idCandidatoSeleccionado = "13";
    const isChecked = true;
    onSelectionChangeFunc(idCandidatoSeleccionado, isChecked);

    expect(mockHandleSeleccion).toHaveBeenCalledTimes(1);
    expect(mockHandleSeleccion).toHaveBeenCalledWith(
      baseProps.categoria,
      idCandidatoSeleccionado,
      isChecked
    );
  });
});
