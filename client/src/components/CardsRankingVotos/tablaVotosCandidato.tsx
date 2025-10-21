import { LoaderCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { RankingVotosCandidatoType } from "@/lib/types";

export const RankingVotosCandidato = ({
  loadingRanking,
  rankingVotos,
  candidatosOrdenados,
  state,
}: RankingVotosCandidatoType) => {
  if (loadingRanking) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-56 text-stone-600 text-lg">
        <LoaderCircle className="animate-spin"></LoaderCircle>
        Cargando datos...
      </div>
    );
  }

  if (rankingVotos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-stone-600 text-lg">
        No hay candidatos
      </div>
    );
  }
  return (
    <ScrollArea className="h-52 w-full rounded-md text-black">
      <div
        className={`flex flex-col gap-2 ${state ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-in-out`}
      >
        {candidatosOrdenados.map((candidatoVotos) => (
          <div
            key={candidatoVotos.idcandidato}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium w-8 pl-1 text-lg">
                {candidatoVotos.codigo_facultad}.
              </span>
              <span className="pl-4 line-clamp-1 text-lg">
                {candidatoVotos.nombre_candidato}
              </span>
            </div>
            <span className="font-bold w-12 shrink-0 text-center text-xl">
              {candidatoVotos.total_votos}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
