import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CandidatoColumn } from "@/components/CardListaCandidatos/candidatoColumn";
import { CandidatoItem } from "@/components/CardListaCandidatos/candidatoItem";
import { mockCandidatos } from "@/lib/mocks";

const mockCandidatoItem = CandidatoItem as jest.Mock;
const mockOnSelectionChange = jest.fn();

/**
 * Componentes
 */
jest.mock("@/components/CardListaCandidatos/candidatoItem", () => ({
  CandidatoItem: jest.fn(({ candidato, isChecked, isDisabled }) => (
    <div data-testid="candidato-item-mock">
      <span>{candidato.apellido}</span>
      <input
        type="checkbox"
        checked={isChecked}
        disabled={isDisabled}
        readOnly
      />
    </div>
  )),
}));

describe("CandidatoColumn", () => {
  // Limpieza
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debería renderizar los encabezados y un CandidatoItem por cada candidato", () => {
    render(
      <CandidatoColumn
        candidatos={mockCandidatos}
        seleccionesCategoria={[]}
        limiteMaximo={3}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    expect(screen.getByText("Fac.")).toBeInTheDocument();
    expect(screen.getByText("Apellidos y Nombres")).toBeInTheDocument();

    const items = screen.getAllByTestId("candidato-item-mock");
    expect(items).toHaveLength(mockCandidatos.length);

    expect(mockCandidatoItem).toHaveBeenCalledTimes(mockCandidatos.length);
  });

  it("Debería pasar 'isChecked' como true a los candidatos seleccionados", () => {
    const selecciones = ["2"];
    render(
      <CandidatoColumn
        candidatos={mockCandidatos}
        seleccionesCategoria={selecciones}
        limiteMaximo={3}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    // Candidato con id = 1 no está seleccionado
    expect(mockCandidatoItem.mock.calls[0][0].isChecked).toBe(false);
    expect(mockCandidatoItem.mock.calls[1][0].isChecked).toBe(true);
    expect(mockCandidatoItem.mock.calls[2][0].isChecked).toBe(false);
  });

  it("Debería deshabilitar los checkboxes no seleccionados cuando se alcanza el límite", () => {
    const selecciones = ["1", "3"];
    const limite = 2;

    render(
      <CandidatoColumn
        candidatos={mockCandidatos}
        seleccionesCategoria={selecciones}
        limiteMaximo={limite}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    // El candidato seleccionado no debe estar deshabilitado.
    expect(mockCandidatoItem.mock.calls[0][0].isDisabled).toBe(false);
    expect(mockCandidatoItem.mock.calls[1][0].isDisabled).toBe(true);
    expect(mockCandidatoItem.mock.calls[2][0].isDisabled).toBe(false);
  });

  it("Debería deshabilitar todos los checkboxes si la prop 'isDisabled' es true", () => {
    render(
      <CandidatoColumn
        candidatos={mockCandidatos}
        seleccionesCategoria={["1"]}
        limiteMaximo={3}
        isDisabled={true}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    // Todos los items deben recibir deshabilitados
    expect(mockCandidatoItem.mock.calls[0][0].isDisabled).toBe(true);
    expect(mockCandidatoItem.mock.calls[1][0].isDisabled).toBe(true);
    expect(mockCandidatoItem.mock.calls[2][0].isDisabled).toBe(true);
  });

  it("Debería pasar correctamente el candidato y la función onSelectionChange a cada item", () => {
    render(
      <CandidatoColumn
        candidatos={mockCandidatos}
        seleccionesCategoria={[]}
        limiteMaximo={3}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const propsPrimerItem = mockCandidatoItem.mock.calls[0][0];

    expect(propsPrimerItem.candidato).toEqual(mockCandidatos[0]);
    expect(propsPrimerItem.onSelectionChange).toBe(mockOnSelectionChange);

    const propsSegundoItem = mockCandidatoItem.mock.calls[1][0];

    expect(propsSegundoItem.candidato).toEqual(mockCandidatos[1]);
    expect(propsSegundoItem.onSelectionChange).toBe(mockOnSelectionChange);
  });

  it("no debería renderizar ningún CandidatoItem si la lista de candidatos está vacía", () => {
    render(
      <CandidatoColumn
        candidatos={[]}
        seleccionesCategoria={[]}
        limiteMaximo={3}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    expect(screen.getByText("Fac.")).toBeInTheDocument();

    expect(screen.queryByTestId("candidato-item-mock")).not.toBeInTheDocument();
    expect(mockCandidatoItem).not.toHaveBeenCalled();
  });
});
