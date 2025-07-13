import { LoaderCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { RankingVotosCandidatoType } from "@/lib/types";

export const RankingVotosCandidato = ({
  loadingRanking,
  rankingVotos,
  candidatosOrdenados,
}: RankingVotosCandidatoType) => {
  if (loadingRanking) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-56 text-stone-600">
        <LoaderCircle className="animate-spin"></LoaderCircle>
        Cargando datos...
      </div>
    );
  }

  if (rankingVotos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-600">
        No hay candidatos
      </div>
    );
  }
  return (
    <ScrollArea className="h-48 w-full rounded-md text-black">
      <div className="flex flex-col gap-1">
        {candidatosOrdenados.map((candidatoVotos) => (
          <div
            key={candidatoVotos.idcandidato}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium w-6 pl-1">
                {candidatoVotos.codigo_facultad}.
              </span>
              <span className="pl-4 line-clamp-1">
                {candidatoVotos.nombre_candidato}
              </span>
            </div>
            <span className="font-bold w-12 shrink-0 text-center">
              {candidatoVotos.total_votos}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
