import { CandidatoItem } from "./candidatoItem";
import { CandidatoColumnType } from "@/lib/types";

export const CandidatoColumn = ({
  candidatos,
  seleccionesCategoria,
  limiteMaximo,
  isDisabled,
  onSelectionChange,
}: CandidatoColumnType) => {
  return (
    <div>
      <div className="font-semibold text-sm flex w-full">
        <div className="w-6 text-center inline-block mr-2 border-stone-600/50 border-b pb-1 mb-1">
          Fac.
        </div>
        <span className="border-stone-600/50 border-b pb-1 mb-1 w-full">
          Apellidos y Nombres
        </span>
      </div>

      {candidatos.map((candidato) => {
        const idCandidatoStr = candidato.idcandidato.toString();
        const isChecked = seleccionesCategoria.includes(idCandidatoStr);
        const isCheckboxDisabled =
          isDisabled ||
          (!isChecked && seleccionesCategoria.length >= limiteMaximo);

        return (
          <CandidatoItem
            key={candidato.idcandidato}
            candidato={candidato}
            isChecked={isChecked}
            isDisabled={isCheckboxDisabled}
            onSelectionChange={onSelectionChange}
          />
        );
      })}
    </div>
  );
};
