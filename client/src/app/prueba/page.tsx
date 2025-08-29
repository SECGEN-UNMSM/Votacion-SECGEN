"use client";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAsambleistas } from "@/hooks/useAsambleistas";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Prueba() {
  useTheme();
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      redirect("/");
    }
  }, []);

  if (navigate) return redirect("/about");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { asambleistas } = useAsambleistas()


  const listaAsambleistas = asambleistas.map((asam) => ({
    value: asam.idasambleista.toString(),
    label: `${asam.apellido}, ${asam.nombre}${asam.ha_votado ? " (Ya votó)" : ""}`,
    isDisabled: asam.ha_votado,
  }));


  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-4 p-8 xl:overflow-y-hidden">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">
          Buscador...
        </h2>
        <Button
          variant={"outline"}
          className="cursor-pointer text-[16px] px-4"
          onClick={() => setNavigate(!navigate)}
        >
          Ir a inicio
        </Button>
      </div>
      <div className="space-y-4">
        <Label htmlFor="asambleista" className="text-lg">
          Lista de asambleístas
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-xl justify-between"
            >
              {value
                ? listaAsambleistas.find(
                    (asambleista) => asambleista.label === value
                  )?.label
                : "Selecciona un asambleista..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-xl p-0">
            <Command>
              <CommandInput
                placeholder="Busca un asambleista..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>Asambleista no encontrado.</CommandEmpty>
                <CommandGroup>
                  {listaAsambleistas.map((a) => (
                    <CommandItem
                      key={a.label}
                      value={a.label}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                      disabled={a.isDisabled}
                    >
                      {a.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === a.label ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
