"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type {
  Asambleista,
  Candidato,
  Categoria,
  VotoCategoria,
  Votos,
} from "@/lib/types";
import { limitesPorCategoria, listaCategorias } from "@/lib/types";
import { Check, ChevronsUpDown, Info, LoaderCircle } from "lucide-react";
import { useAsambleistas } from "@/hooks/useAsambleistas";
import { useCandidatos } from "@/hooks/useCandidatos";
import { useVotos } from "@/hooks/useVotos";
import RankingVotos from "./CardsRankingVotos/rankingVotos";
import { useTheme } from "@/hooks/useTheme";
import { ListaCandidatos } from "./CardListaCandidatos/listaCandidatos";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn, getColorCategoria } from "@/lib/utils";
import Swal from "sweetalert2";

export default function SistemaVotacion() {
  const { isDark } = useTheme();
  const { asambleistas: asamDesdeContexto, loading: loadingAsambleista } =
    useAsambleistas();
  const { candidatos: candDesdeContexto, loading: loadingCandidato } =
    useCandidatos();
  const { rankingVotos, agregarVoto } = useVotos();
  const [asambleistas, setAsambleistas] = useState<Asambleista[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [asambleistaSeleccionado, setAsambleistaSeleccionado] = useState<{
    value: string;
    label: string;
  } | null>();
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>(
    "Docentes Principales"
  );
  const [selecciones, setSelecciones] = useState<Record<Categoria, string[]>>({
    "Docentes Principales": [],
    "Docentes Asociados": [],
    "Docentes Auxiliares": [],
    Estudiantes: [],
  });
  const [abstenciones, setAbstenciones] = useState<Record<Categoria, boolean>>({
    "Docentes Principales": false,
    "Docentes Asociados": false,
    "Docentes Auxiliares": false,
    Estudiantes: false,
  });
  //const [modalConfirmacion, setModalConfirmacion] = useState<boolean>(false);
  const [openSelectAsam, setOpenSelectAsam] = useState<boolean>(false);

  useEffect(() => {
    if (asamDesdeContexto && asamDesdeContexto.length > 0) {
      setAsambleistas(asamDesdeContexto);
    } else {
      setAsambleistas([]);
    }
  }, [asamDesdeContexto, loadingAsambleista]);

  useEffect(() => {
    if (candDesdeContexto && candDesdeContexto.length > 0) {
      setCandidatos(candDesdeContexto);
    } else {
      setCandidatos([]);
    }
  }, [candDesdeContexto, loadingCandidato]);

  const listaAsambleistas = asambleistas
    .map((asam) => ({
      value: asam.idasambleista.toString(),
      label: `${asam.apellido}, ${asam.nombre}${
        asam.ha_votado ? " (Ya votó)" : ""
      }`,
      isDisabled: asam.ha_votado,
      id: parseInt(asam.idasambleista.toString()),
    }))
    .sort((a, b) => {
      // Ordenar por ID
      if (a.isDisabled && !b.isDisabled) return 1;
      if (!a.isDisabled && b.isDisabled) return -1;
      return a.id - b.id;
    });

  // Manejar la selección de un candidato
  const handleSeleccionCandidato = (
    categoria: Categoria,
    candidatoId: string,
    checked: boolean
  ) => {
    // Si la categoría está en abstención, no permitir seleccionar candidatos
    if (abstenciones[categoria]) return;

    setSelecciones((prev) => {
      const seleccionesActuales = [...prev[categoria]];

      if (checked) {
        // Si ya alcanzó el límite, no permitir más selecciones
        if (
          seleccionesActuales.length >= limitesPorCategoria[categoria].maximo
        ) {
          return prev;
        }
        return {
          ...prev,
          [categoria]: [...seleccionesActuales, candidatoId],
        };
      } else {
        return {
          ...prev,
          [categoria]: seleccionesActuales.filter(
            (id) => id !== candidatoId.toString()
          ),
        };
      }
    });
  };

  // Manejar la abstención en una categoría
  const handleAbstencion = (categoria: Categoria, abstenerse: boolean) => {
    // Actualizar el estado de abstención
    setAbstenciones((prev) => ({
      ...prev,
      [categoria]: abstenerse,
    }));

    // Si se abstiene, limpiar las selecciones de esa categoría
    if (abstenerse) {
      setSelecciones((prev) => ({
        ...prev,
        [categoria]: [],
      }));
    }
  };

  const categoriaEsValida = (categoria: Categoria): boolean => {
    if (abstenciones[categoria]) {
      return true; // Si se abstiene, es válida
    }
    const numSelecciones = selecciones[categoria].length;
    const limites = limitesPorCategoria[categoria];
    return numSelecciones >= limites.minimo && numSelecciones <= limites.maximo;
  };

  // Verificar si se cumple con los requisitos para habilitar el botón de emitir voto
  const puedeEmitirVoto = () => {
    if (!asambleistaSeleccionado) return false;

    // Verificar que cada categoría sea válida (abstención o selección dentro de límites)
    return listaCategorias.every((categoria) => categoriaEsValida(categoria));
  };

  // Abrir modal de confirmación
  /*const confirmarVoto = () => {
    setModalConfirmacion(true);
  };*/

  // Emitir voto
  const emitirVoto = async () => {
    if (!asambleistaSeleccionado) return;

    const votos: VotoCategoria[] = listaCategorias.map((categoria) => {
      if (abstenciones[categoria]) {
        return {
          categoria: categoria,
          abstencion: true,
        };
      } else {
        return {
          categoria: categoria,
          idcandidatos: selecciones[categoria].map((id) => parseInt(id)),
        };
      }
    });

    const data: Votos = {
      idasambleista: parseInt(asambleistaSeleccionado.value),
      votos: votos,
    };

    try {
      //console.log(data);

      /*toast.promise(agregarVoto(data), {
        loading: "Guardando voto...",
        success: <b>Voto guardado!</b>,
        error: <b>No se puedo guardar el voto.</b>,
      });*/

      Swal.fire({
        title: "Procesando voto...",
        text: "Por favor, espera.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showConfirmButton: false,
        theme: isDark ? "dark" : "light",
      });

      agregarVoto(data)
        .then(() => {
          Swal.hideLoading();
          Swal.update({
            icon: "success",
            title: "¡Voto procesado!",
            text: `El voto ha sido procesado exitosamente.`,
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#28A745",
          });
        })
        .catch(() => {
          Swal.hideLoading();
          Swal.update({
            icon: "error",
            title: "Error",
            text: "Algo salió mal",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#dc3545",
          });
        });

      // Reiniciar selecciones y abstenciones
      setSelecciones({
        "Docentes Principales": [],
        "Docentes Asociados": [],
        "Docentes Auxiliares": [],
        Estudiantes: [],
      });
      setAbstenciones({
        "Docentes Principales": false,
        "Docentes Asociados": false,
        "Docentes Auxiliares": false,
        Estudiantes: false,
      });
      setAsambleistaSeleccionado({ value: "", label: "" });
      //setModalConfirmacion(false);
    } catch (error) {
      console.error("Error al enviar los datos", error);
    }
  };

  const todasEnAbstencion = listaCategorias.every(
    (categoria) => abstenciones[categoria]
  );

  return (
    <main className="grid grid-cols-1 gap-6">
      <div className="flex flex-col xl:grid xl:grid-cols-4 gap-4">
        {/* Sección de Votación */}
        <Card className="col-span-1 flex flex-col gap-2 border-1 border-[var(--border-color)] dark:border-stone-700 p-2">
          <CardHeader className="p-0">
            <CardTitle className="flex justify-center items-center bg-[var(--bg-title)] dark:bg-black py-3 rounded-sm text-xl">
              Votación
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-4">
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
                                key={a.label}
                                value={a.label}
                                onSelect={(currentValue) => {
                                  const seleccionado = listaAsambleistas.find(
                                    (a) => a.label === currentValue
                                  );
                                  setAsambleistaSeleccionado(seleccionado);
                                  setOpenSelectAsam(false);
                                }}
                                disabled={a.isDisabled}
                                className="text-lg"
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
              </div>

              {todasEnAbstencion && (
                <div className="flex gap-3 items-center text-sm text-slate-500 p-2 rounded-md border-1 border-slate-300">
                  <Info className="h-5 w-5" />
                  <p>Se ha abstenido de todas las categorías.</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={emitirVoto}
                  disabled={!puedeEmitirVoto()}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer flex-1 py-5 text-lg select-none"
                >
                  Emitir voto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Candidatos */}
        <Card className="col-span-3 flex flex-col gap-2 border-1 border-[var(--border-color)] dark:border-stone-700 p-2">
          <CardHeader className="p-0">
            <CardTitle className="flex justify-center items-center bg-[var(--bg-title)] dark:bg-black py-3 rounded-sm text-xl">
              Candidatos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              defaultValue="Docentes Principales"
              value={categoriaActiva}
              onValueChange={(value) => setCategoriaActiva(value as Categoria)}
            >
              <TabsList className="grid grid-cols-2 gap-2 h-20 xl:grid-cols-4 xl:gap-4 w-full xl:h-12">
                {listaCategorias.map((categoria) => {
                  const isActive = categoria == categoriaActiva;
                  return (
                    <TabsTrigger
                      key={categoria}
                      value={categoria}
                      className={`rounded-md border-1 border-[var(--text-color)]/15 cursor-pointer hover:opacity-80  text-xl ${
                        isActive
                          ? getColorCategoria(categoria)
                          : "hover:bg-stone-300/40 dark:hover:bg-stone-700"
                      }`}
                    >
                      {categoria}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {listaCategorias.map((categoria) => (
                <TabsContent
                  key={categoria}
                  value={categoria}
                  className="p-4  dark:bg-black dark:text-white/90 rounded-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-lg">
                      {abstenciones[categoria] && (
                        <span className="text-gray-500 italic dark:text-stone-300">
                          Abstención seleccionada
                        </span>
                      )}
                      {!abstenciones[categoria] && (
                        <div className="text-gray-500 mt-1 dark:text-stone-400">
                          Rango: {limitesPorCategoria[categoria].minimo} -{" "}
                          {limitesPorCategoria[categoria].maximo} candidatos
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={abstenciones[categoria]}
                        onCheckedChange={(checked) =>
                          handleAbstencion(categoria, checked)
                        }
                        id={`abstencion-${categoria}`}
                        className="dark:bg-stone-300 dark:border-stone-600"
                      />
                      <Label
                        htmlFor={`abstencion-${categoria}`}
                        className="text-lg text-gray-600 dark:text-stone-400"
                      >
                        Abstención
                      </Label>
                    </div>
                  </div>

                  <ListaCandidatos
                    categoria={categoria}
                    loadingCandidato={loadingCandidato}
                    candidatos={candidatos}
                    rankingVotos={rankingVotos}
                    abstenciones={abstenciones}
                    selecciones={selecciones}
                    limitesPorCategoria={limitesPorCategoria}
                    handleSeleccionCandidato={handleSeleccionCandidato}
                  ></ListaCandidatos>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Sección de Resultados */}
        <Card className="col-span-4 flex-flex-col gap-2 border-1 border-[var(--border-color)] dark:border-stone-700 p-2">
          <CardHeader className="p-0">
            <CardTitle className="flex justify-center items-center bg-[var(--bg-title)] dark:bg-black py-3 rounded-sm text-xl">
              Resultados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <RankingVotos></RankingVotos>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmación */}
      {/*
        
        <Dialog open={modalConfirmacion} onOpenChange={setModalConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Confirmar Votación</DialogTitle>
            <DialogDescription className="text-[16px]">
              Por favor confirme su selección de candidatos:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {listaCategorias.map((categoria) => {
              const candidatosSeleccionados = selecciones[categoria]
                .map((idcandidato) =>
                  candidatos.find(
                    (c) => c.idcandidato.toString() === idcandidato
                  )
                )
                .filter(Boolean) as Candidato[];

              return (
                <div key={categoria} className="mb-4">
                  <h4 className="font-medium text-lg">{categoria}:</h4>
                  {abstenciones[categoria] ? (
                    <p className="pl-5 mt-1 italic text-gray-500 text-lg">
                      Abstención
                    </p>
                  ) : (
                    <ul className="list-none pl-5 mt-1">
                      {candidatosSeleccionados.map((candidato) => (
                        <li
                          key={candidato.idcandidato}
                          className="flex items-center gap-2 text-lg pb-2"
                        >
                          <span className="font-medium w-8">
                            {candidato.codigo_facultad}.
                          </span>
                          <span>{candidato.nombre}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="text-[16px] px-4 cursor-pointer"
              onClick={() => setModalConfirmacion(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={emitirVoto}
              className="bg-green-600 hover:bg-green-700 text-[16px] px-4 cursor-pointer"
            >
              Confirmar Voto
            </Button>
            </DialogFooter>
            </DialogContent>
          </Dialog>

        */}
    </main>
  );
}
