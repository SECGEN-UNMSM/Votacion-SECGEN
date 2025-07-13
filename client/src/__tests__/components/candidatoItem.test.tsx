import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CandidatoItem } from "@/components/CardListaCandidatos/candidatoItem";
import { mockCandidato } from "@/lib/mocks";

const mockOnSelectionChange = jest.fn();

describe("CandidatoItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debería renderizar la información del candidato correctamente", () => {
    render(
      <CandidatoItem
        candidato={mockCandidato}
        isChecked={false}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    expect(
      screen.getByText(mockCandidato.nombre_candidato)
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("Debería mostrar el checkbox como marcado si isChecked es true", () => {
    render(
      <CandidatoItem
        candidato={mockCandidato}
        isChecked={true}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("Debería mostrar el checkbox como deshabilitado si isDisabled es true", () => {
    render(
      <CandidatoItem
        candidato={mockCandidato}
        isChecked={false}
        isDisabled={true}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("Debería llamar a onSelectionChange cuando el usuario marca el checkbox", async () => {
    const user = userEvent.setup();
    render(
      <CandidatoItem
        candidato={mockCandidato}
        isChecked={false}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
    expect(mockOnSelectionChange).toHaveBeenCalledWith(
      mockCandidato.idcandidato.toString(),
      true
    );
  });

  it("Debería llamar a onSelectionChange cuando el usuario desmarca el checkbox", async () => {
    const user = userEvent.setup();
    render(
      <CandidatoItem
        candidato={mockCandidato}
        isChecked={true}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
    expect(mockOnSelectionChange).toHaveBeenCalledWith(
      mockCandidato.idcandidato.toString(),
      false
    );
  });

  it("Debería cambiar el estado del checkbox al hacer clic en la etiqueta asociada", async () => {
    const user = userEvent.setup();
    render(
      <CandidatoItem
        candidato={mockCandidato}
        isChecked={false}
        isDisabled={false}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const label = screen.getByText(mockCandidato.nombre_candidato);

    await user.click(label);

    expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
    expect(mockOnSelectionChange).toHaveBeenCalledWith(
      mockCandidato.idcandidato.toString(),
      true
    );
  });

  it("No debería llamar a onSelectionChange si el checkbox está deshabilitado", async () => {
    const user = userEvent.setup();
    render(
      <CandidatoItem
        candidato={mockCandidato}
        isChecked={false}
        isDisabled={true}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(mockOnSelectionChange).not.toHaveBeenCalled();
  });
});
