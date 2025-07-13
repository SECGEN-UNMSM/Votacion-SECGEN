import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RankingVotosCandidato } from "@/components/CardsRankingVotos/tablaVotosCandidato";
import { mockCandidatosOrdenados } from "@/lib/mocks";

jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-area-mock">{children}</div>
  ),
}));

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  LoaderCircle: () => <div data-testid="loader-mock" />,
}));

describe("RankingVotosCandidato", () => {
  it("Debería mostrar el spinner de carga cuando loadingRanking es true", () => {
    render(
      <RankingVotosCandidato
        loadingRanking={true}
        rankingVotos={[]}
        candidatosOrdenados={[]}
      />
    );

    expect(screen.getByTestId("loader-mock")).toBeInTheDocument();
    expect(screen.getByText("Cargando datos...")).toBeInTheDocument();
    expect(screen.queryByTestId("scroll-area-mock")).not.toBeInTheDocument();
  });

  it("Debería mostrar un mensaje de 'No hay candidatos' cuando rankingVotos está vacío", () => {
    render(
      <RankingVotosCandidato
        loadingRanking={false}
        rankingVotos={[]}
        candidatosOrdenados={[]}
      />
    );

    expect(screen.getByText("No hay candidatos")).toBeInTheDocument();
    expect(screen.queryByTestId("loader-mock")).not.toBeInTheDocument();
    expect(screen.queryByTestId("scroll-area-mock")).not.toBeInTheDocument();
  });

  it("Debería renderizar la lista de candidatos cuando se tiene datos", () => {
    render(
      <RankingVotosCandidato
        loadingRanking={false}
        rankingVotos={[
          {
            idcandidato: 11,
            nombre_candidato: "Juan Carlos",
            categoria: "Docentes Asociados",
            codigo_facultad: "13",
            total_votos: "15",
          },
        ]}
        candidatosOrdenados={mockCandidatosOrdenados}
      />
    );

    expect(screen.getByTestId("scroll-area-mock")).toBeInTheDocument();
    expect(screen.queryByText("Cargando datos...")).not.toBeInTheDocument();
    expect(screen.queryByText("No hay candidatos")).not.toBeInTheDocument();
  });

  it("Debería mostrar la información de cada candidato", () => {
    render(
      <RankingVotosCandidato
        loadingRanking={false}
        rankingVotos={[
          {
            idcandidato: 11,
            nombre_candidato: "Juan Carlos",
            categoria: "Docentes Asociados",
            codigo_facultad: "13",
            total_votos: "15",
          },
        ]}
        candidatosOrdenados={mockCandidatosOrdenados}
      />
    );

    const items = screen
      .getByTestId("scroll-area-mock")
      .querySelectorAll(".flex.justify-between.items-center");
    expect(items).toHaveLength(mockCandidatosOrdenados.length);

    const primerItem = items[0];
    expect(primerItem).toHaveTextContent("13");
    expect(primerItem).toHaveTextContent("Juan Carlos");
    expect(primerItem).toHaveTextContent("15");

    const segundoItem = items[1];
    expect(segundoItem).toHaveTextContent("04");
    expect(segundoItem).toHaveTextContent("María Fernanda");
    expect(segundoItem).toHaveTextContent("13");

    const tercerItem = items[2];
    expect(tercerItem).toHaveTextContent("01");
    expect(tercerItem).toHaveTextContent("Ana López");
    expect(tercerItem).toHaveTextContent("9");
  });

  it("Debería renderizar una lista vacía si candidatosOrdenados está vacío pero rankingVotos tiene datos", () => {
    render(
      <RankingVotosCandidato
        loadingRanking={false}
        rankingVotos={[
          {
            idcandidato: 11,
            nombre_candidato: "Juan Carlos",
            categoria: "Docentes Asociados",
            codigo_facultad: "13",
            total_votos: "15",
          },
        ]}
        candidatosOrdenados={[]}
      />
    );

    expect(screen.getByTestId("scroll-area-mock")).toBeInTheDocument();

    const items = screen
      .getByTestId("scroll-area-mock")
      .querySelector(".flex.justify-between.items-center");
    expect(items).toBeNull();
  });
});
