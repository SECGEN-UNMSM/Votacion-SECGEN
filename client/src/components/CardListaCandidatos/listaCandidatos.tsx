import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle } from "lucide-react";
import { CandidatoColumn } from "./candidatoColumn";
import { getCandidatosPorCategoria } from "@/lib/utils";
import { ListaCandidatosType } from "@/lib/types";

export const ListaCandidatos = ({
  categoria,
  loadingCandidato,
  candidatos,
  rankingVotos,
  abstenciones,
  selecciones,
  limitesPorCategoria,
  handleSeleccionCandidato,
}: ListaCandidatosType) => {
  // Solo se recalculará si rankingVotos o categoria cambian.
  const candidatosPorColumna = useMemo(() => {
    if (!candidatos || candidatos.length === 0) {
      return [];
    }
    const candidatosOrdenados = getCandidatosPorCategoria(
      rankingVotos,
      categoria
    )
      .slice()
      .sort((a, b) => a.codigo_facultad.localeCompare(b.codigo_facultad));

    const totalCandidatos = candidatosOrdenados.length;
    const candidatosPorColumnaBase = Math.floor(totalCandidatos / 4);
    const resto = totalCandidatos % 4;

    const chunks = [];
    let inicio = 0;
    for (let i = 0; i < 4; i++) {
      const tamanoColumna = candidatosPorColumnaBase + (i < resto ? 1 : 0);
      chunks.push(candidatosOrdenados.slice(inicio, inicio + tamanoColumna));
      inicio += tamanoColumna;
    }

    return chunks;
  }, [rankingVotos, categoria, candidatos]);

  if (loadingCandidato) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-60 text-stone-600">
        <LoaderCircle className="animate-spin" />
        Cargando datos...
      </div>
    );
  }

  if (candidatos.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-stone-600">
        No hay candidatos
      </div>
    );
  }

  const onSelectionChange = (idCandidato: string, isChecked: boolean) => {
    handleSeleccionCandidato(categoria, idCandidato, isChecked);
  };

  const isAbstenido = abstenciones[categoria];
  const gridClasses = isAbstenido
    ? "opacity-50 pointer-events-none grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 xl:gap-4 xl:grid-cols-4"
    : "grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 xl:gap-4 xl:grid-cols-4";

  return (
    <ScrollArea className="h-60 w-full">
      <div className={gridClasses}>
        {candidatosPorColumna.map((columna, index) => {
          return (
            <CandidatoColumn
              key={index}
              candidatos={columna}
              seleccionesCategoria={selecciones[categoria]}
              limiteMaximo={limitesPorCategoria[categoria].maximo}
              isDisabled={isAbstenido}
              onSelectionChange={onSelectionChange}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};
