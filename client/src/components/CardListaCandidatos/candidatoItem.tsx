import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CandidatoItemType } from "@/lib/types";

export const CandidatoItem = ({
  candidato,
  isChecked,
  isDisabled,
  onSelectionChange,
}: CandidatoItemType) => {
  const handleCheckedChange = (checked: boolean) => {
    onSelectionChange(candidato.idcandidato.toString(), checked === true);
  };

  return (
    <div className="flex items-center space-x-2 py-2 border-b border-stone-600/50 text-lg">
      <div className="w-6 text-center font-medium">
        {candidato.codigo_facultad}
      </div>
      <Checkbox
        id={candidato.idcandidato.toString()}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        disabled={isDisabled}
        className="dark:text-black dark:border-white"
      />
      <Label
        htmlFor={candidato.idcandidato.toString()}
        className="cursor-pointer line-clamp-1 text-[16px] font-normal"
      >
        {candidato.nombre_candidato}
      </Label>
    </div>
  );
};
