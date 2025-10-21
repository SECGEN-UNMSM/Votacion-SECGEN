import { Check, ChevronsUpDown, Command, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { ListaAsambleistaType } from "@/lib/types";
import { useState } from "react";

export type SelectPopoverProps = {
  asambleistaSeleccionado?: { label: string; value: string } | null;
  listaAsambleistas: ListaAsambleistaType[];
  loadingAsambleista: boolean;
  setAsambleistaSeleccionado: (option: ListaAsambleistaType) => void;
};

export function SelectPopover({
  asambleistaSeleccionado,
  listaAsambleistas,
  loadingAsambleista,
  setAsambleistaSeleccionado,
}: SelectPopoverProps) {
  const [openSelectAsam, setOpenSelectAsam] = useState<boolean>();

  return (
    <Popover open={openSelectAsam} onOpenChange={setOpenSelectAsam}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openSelectAsam}
          className="w-full justify-between text-lg"
        >
          {asambleistaSeleccionado?.label
            ? listaAsambleistas.find(
                (asambleista) =>
                  asambleista.label === asambleistaSeleccionado.label
              )?.label
            : "Selecciona un asambleista"}
          <ChevronsUpDown className="opacity-0 2xl:opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="2xl:min-w-md w-full p-0 border dark:border-stone-500">
        {loadingAsambleista ? (
          <Command>
            <CommandEmpty className="text-lg text-center p-4 text-stone-600 select-none flex items-center justify-center gap-4">
              <LoaderCircle className="animate-spin"></LoaderCircle>
              Cargando datos...
            </CommandEmpty>
          </Command>
        ) : (
          <Command>
            <CommandInput
              placeholder="Busca un asambleista..."
              className="h-9 text-lg"
            />
            <CommandList>
              <CommandEmpty className="text-lg text-center p-4">
                Asambleista no encontrado.
              </CommandEmpty>
              <CommandGroup>
                {listaAsambleistas.map((a) => (
                  <CommandItem
                    key={a.value}
                    // Usar label para búsqueda manteniendo a value como identificación
                    value={a.label}
                    onSelect={() => {
                      // Usar directamente el objeto actual para la selección en vez de buscar por label
                      if (!a.isDisabled) {
                        setAsambleistaSeleccionado(a);
                        setOpenSelectAsam(false);
                        console.log("Asambleísta seleccionado:", a);
                      }
                    }}
                    disabled={a.isDisabled}
                    className={`text-lg ${a.isDisabled ? "opacity-50" : ""}`}
                  >
                    {a.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        asambleistaSeleccionado?.value === a.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}

/*
<Popover open={openSelectAsam} onOpenChange={setOpenSelectAsam}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={openSelectAsam}
      className="w-full justify-between text-lg"
    >
      {asambleistaSeleccionado?.label
        ? listaAsambleistas.find(
            (asambleista) =>
              asambleista.label ===
              asambleistaSeleccionado.label
          )?.label
        : "Selecciona un asambleista"}
      <ChevronsUpDown className="opacity-0 2xl:opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="2xl:min-w-md w-full p-0 border dark:border-stone-500">
    {loadingAsambleista ? (
      <Command>
        <CommandEmpty className="text-lg text-center p-4 text-stone-600 select-none flex items-center justify-center gap-4">
          <LoaderCircle className="animate-spin"></LoaderCircle>
          Cargando datos...
        </CommandEmpty>
      </Command>
    ) : (
      <Command>
        <CommandInput
          placeholder="Busca un asambleista..."
          className="h-9 text-lg"
        />
        <CommandList>
          <CommandEmpty className="text-lg text-center p-4">
            Asambleista no encontrado.
          </CommandEmpty>
          <CommandGroup>
            {listaAsambleistas.map((a) => (
              <CommandItem
                key={a.value}
                // Usar label para búsqueda manteniendo a value como identificación
                value={a.label}
                onSelect={() => {
                  // Usar directamente el objeto actual para la selección en vez de buscar por label
                  if (!a.isDisabled) {
                    setAsambleistaSeleccionado(a);
                    setOpenSelectAsam(false);
                    console.log("Asambleísta seleccionado:", a);
                  }
                }}
                disabled={a.isDisabled}
                className={`text-lg ${
                  a.isDisabled ? "opacity-50" : ""
                }`}
              >
                {a.label}
                <Check
                  className={cn(
                    "ml-auto",
                    asambleistaSeleccionado?.value === a.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )}
  </PopoverContent>
</Popover>
*/
