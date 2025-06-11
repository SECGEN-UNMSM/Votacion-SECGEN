import { Categoria } from "@/lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { categorias } from "@/lib/data";
import { LoaderCircle } from "lucide-react";
import { useVotos } from "@/hooks/useVotos";
import { getCandidatosPorCategoria } from "@/lib/utils";

export default function RankingVotos() {
  const { loading: loadingRanking, rankingVotos} = useVotos();

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
      {categorias.map((categoria) => {
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
            <h3 className="font-bold mb-4 text-center text-black">{categoria}</h3>
            <div className="flex gap-2 w-full mb-4 font-semibold ">
              <div className={`border-b-2 pb-2 border-white/40 text-sm dark:text-black`}>
                Fac.
              </div>
              <div className="flex-1 border-b-2 pb-2 border-white/40 text-sm text-black">
                Apellidos y Nombres
              </div>
              <div className="border-b-2 border-white/40 text-sm text-black">Votos</div>
            </div>
            <ScrollArea className="h-48 w-full rounded-md text-black">
              {loadingRanking ? (
                <div className="flex flex-col gap-4 items-center justify-center h-56 text-stone-600">
                  <LoaderCircle className="animate-spin"></LoaderCircle>
                  Cargando datos...
                </div>
              ) : rankingVotos.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-stone-600">
                  No hay candidatos
                </div>
              ) : (
                candidatosOrdenados.map((candidatoVotos) => (
                  <div
                    key={candidatoVotos.idcandidato}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium w-6 pl-1">
                        {candidatoVotos.codigo_facultad}.
                      </span>
                      <span className="pl-4">
                        {candidatoVotos.nombre_candidato}
                      </span>
                    </div>
                    <span className="font-bold w-12 text-center">
                      {candidatoVotos.total_votos}
                    </span>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        );
      })}
    </>
  );
}