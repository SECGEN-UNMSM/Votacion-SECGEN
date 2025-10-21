"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type {
  Asambleista,
  Candidato,
  Categoria,
  ListaAsambleistaType,
  VotoCategoria,
  Votos,
} from "@/lib/types";
import { limitesPorCategoria, listaCategorias } from "@/lib/types";
import { useAsambleistas } from "@/hooks/useAsambleistas";
import { useCandidatos } from "@/hooks/useCandidatos";
import { useVotos } from "@/hooks/useVotos";
import RankingVotos from "./CardsRankingVotos/rankingVotos";
import { useTheme } from "@/hooks/useTheme";
import { ListaCandidatos } from "./CardListaCandidatos/listaCandidatos";
import { getColorCategoria } from "@/lib/utils";
import Swal from "sweetalert2";
import { SelectPopover } from "./SelectPopover";
import { Info } from "lucide-react";

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

  const listaAsambleistas: ListaAsambleistaType[] = asambleistas
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
    // Verificar que se haya seleccionado un asambleísta válido (con value no vacío)
    if (!asambleistaSeleccionado || !asambleistaSeleccionado.value)
      return false;

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
      Swal.fire({
        title: "Procesando voto...",
        text: "Por favor, espera.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showConfirmButton: false,
        theme: isDark ? "dark" : "light",
      });

      try {
        await agregarVoto(data);

        Swal.hideLoading();
        Swal.update({
          icon: "success",
          title: "¡Voto procesado!",
          text: `El voto ha sido procesado exitosamente.`,
          showConfirmButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#28A745",
        });
      } catch (error) {
        Swal.hideLoading();
        Swal.update({
          icon: "error",
          title: "Error",
          text: "Algo salió mal",
          showConfirmButton: true,
          confirmButtonText: "Ok",
          confirmButtonColor: "#dc3545",
        });
        console.log("Error al enviar los datos", error);
      }

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
                <SelectPopover
                  listaAsambleistas={listaAsambleistas}
                  asambleistaSeleccionado={asambleistaSeleccionado}
                  setAsambleistaSeleccionado={setAsambleistaSeleccionado}
                  loadingAsambleista={loadingAsambleista}
                ></SelectPopover>
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
    </main>
  );
}
