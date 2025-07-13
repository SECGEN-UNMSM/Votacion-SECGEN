import { Categoria, listaCategorias } from "@/lib/types";
import { useVotos } from "@/hooks/useVotos";
import { getCandidatosPorCategoria } from "@/lib/utils";
import { RankingVotosCandidato } from "./tablaVotosCandidato";

export default function RankingVotos() {
  const { loading: loadingRanking, rankingVotos } = useVotos();

  // Obtener el color de fondo para cada categoría
  const getColorCategoria = (categoria: Categoria) => {
    switch (categoria) {
      case "Docentes Principales":
        return "bg-[var(--bg-doc-principales)]";
      case "Docentes Asociados":
        return "bg-[var(--bg-doc-asociados)]";
      case "Docentes Auxiliares":
        return "bg-[var(--bg-doc-auxiliares)]";
      case "Estudiantes":
        return "bg-[var(--bg-estudiantes)]";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <>
      {listaCategorias.map((categoria) => {
        // Ordenar candidatos por votos (descendente)
        const candidatosOrdenados = [
          ...getCandidatosPorCategoria(rankingVotos, categoria),
        ].sort((a, b) => parseInt(b.total_votos) - parseInt(a.total_votos));

        return (
          <div
            key={categoria}
            className={`${getColorCategoria(
              categoria
            )} rounded-lg p-4 min-h-[300px]`}
          >
            <h3 className="font-bold mb-4 text-center text-black">
              {categoria}
            </h3>
            <div className="flex gap-2 w-full mb-4 font-semibold ">
              <div
                className={`border-b-2 pb-2 border-white/40 text-sm dark:text-black`}
              >
                Fac.
              </div>
              <div className="flex-1 border-b-2 pb-2 border-white/40 text-sm text-black">
                Apellidos y Nombres
              </div>
              <div className="border-b-2 border-white/40 text-sm text-black">
                Votos
              </div>
            </div>
            <RankingVotosCandidato
              loadingRanking={loadingRanking}
              rankingVotos={rankingVotos}
              candidatosOrdenados={candidatosOrdenados}
            ></RankingVotosCandidato>
          </div>
        );
      })}
    </>
  );
}
