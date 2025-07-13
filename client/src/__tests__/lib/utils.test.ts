import { getCandidatosPorCategoria } from "../../lib/utils";
import { mockRanking, mockResultado } from "../../lib/mocks";

describe("getCandidatosPorCategoria", () => {
  it("Devuelve una lista de candidatos por categoria", () => {
    const mockCategoria = "Docentes Principales";
    expect(getCandidatosPorCategoria(mockRanking, mockCategoria)).toEqual(
      mockResultado
    );
  });
});
