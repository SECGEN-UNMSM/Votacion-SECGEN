"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAsambleistas } from "@/hooks/useAsambleistas";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export function ComponentePrueba() {
  useTheme();
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      redirect("/");
    }
  }, []);

  if (navigate) return redirect("/about");
  const [openSelectAsam, setOpenSelectAsam] = React.useState(false);
  const { asambleistas, loading: loadingAsambleista } = useAsambleistas();
  const [asambleistaSeleccionado, setAsambleistaSeleccionado] =
    useState<string>("");

  const listaAsambleistas = asambleistas.map((asam) => ({
    value: asam.idasambleista.toString(),
    label: `${asam.apellido}, ${asam.nombre}${
      asam.ha_votado ? " (Ya votó)" : ""
    }`,
    isDisabled: asam.ha_votado,
  }));

  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-4 p-8 xl:overflow-y-hidden">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Buscador...</h2>
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
        <Popover open={openSelectAsam} onOpenChange={setOpenSelectAsam}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSelectAsam}
              className="w-xl justify-between text-lg"
            >
              {asambleistaSeleccionado
                ? listaAsambleistas.find(
                    (asambleista) =>
                      asambleista.label === asambleistaSeleccionado
                  )?.label
                : "Selecciona un asambleista..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-xl p-0">
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
                        key={a.label}
                        value={a.label}
                        onSelect={(currentValue) => {
                          setAsambleistaSeleccionado(
                            currentValue === asambleistaSeleccionado
                              ? ""
                              : currentValue
                          );
                          setOpenSelectAsam(false);
                        }}
                        disabled={a.isDisabled}
                        className="text-lg"
                      >
                        {a.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            asambleistaSeleccionado === a.label
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

        {/*
            <Label htmlFor="asambleista" className="text-lg">
              Lista de asambleístas
            </Label>
            <Select
              value={asambleistaSeleccionado}
              onValueChange={setAsambleistaSeleccionado}
            >
              <SelectTrigger className="w-full text-lg py-5">
                <SelectValue placeholder="Asambleísta" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {loadingAsambleista ? (
                  <SelectItem
                    key={"loading"}
                    value="loading-data"
                    className="text-lg"
                  >
                    <LoaderCircle className="animate-spin"></LoaderCircle>
                    Cargando datos...
                  </SelectItem>
                ) : (
                  asambleistas.map((asambleista: Asambleista) => (
                    <SelectItem
                      key={asambleista.idasambleista}
                      value={asambleista.idasambleista.toString()}
                      disabled={asambleista.ha_votado}
                      className="text-lg line-clamp-1"
                    >
                      {asambleista.apellido}, {asambleista.nombre}
                      {asambleista.ha_votado && " (Ya votó)"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

          */}
      </div>
    </div>
  );
}
