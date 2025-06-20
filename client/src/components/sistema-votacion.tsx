"use client"

import { useEffect, useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type {
  Asambleista,
  AsambleistaBack,
  CandidatoBack,
  Categoria,
  VotoCategoria,
  VotosBack
} from "@/lib/types"
import { categorias } from "@/lib/data"
import { limitesPorCategoria } from "@/lib/types"
import { ScrollArea } from "./ui/scroll-area"
import { Info, LoaderCircle } from "lucide-react"
import { useAsambleistas } from "@/hooks/useAsambleistas"
import { useCandidatos } from "@/hooks/useCandidatos"
import { useVotos } from "@/hooks/useVotos"
import RankingVotos from "./rankingVotos"
import { getCandidatosPorCategoria } from "@/lib/utils"
import { useDarkMode } from "@/hooks/useDarkMode"

export default function SistemaVotacion() {
  const [] = useDarkMode();
  const { asambleistas: asamDesdeContexto, loading: loadingAsambleista } = useAsambleistas();
  const { candidatos: candDesdeContexto, loading: loadingCandidato } = useCandidatos();
  const { rankingVotos, agregarVoto } = useVotos();
  const [asambleistas, setAsambleistas] = useState<Asambleista[]>([])
  const [candidatos, setCandidatos] = useState<CandidatoBack[]>([])
  const [asambleistaSeleccionado, setAsambleistaSeleccionado] = useState<string>("")
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("Docentes Principales")
  const [selecciones, setSelecciones] = useState<Record<Categoria, string[]>>({
    "Docentes Principales": [],
    "Docentes Asociados": [],
    "Docentes Auxiliares": [],
    "Estudiantes": [],
  })
  const [abstenciones, setAbstenciones] = useState<Record<Categoria, boolean>>({
    "Docentes Principales": false,
    "Docentes Asociados": false,
    "Docentes Auxiliares": false,
    "Estudiantes": false,
  })
  const [modalConfirmacion, setModalConfirmacion] = useState<boolean>(false)

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

  // Manejar la selección de un candidato
  const handleSeleccionCandidato = (categoria: Categoria, candidatoId: string, checked: boolean) => {
    // Si la categoría está en abstención, no permitir seleccionar candidatos
    if (abstenciones[categoria]) return

    setSelecciones((prev) => {
      const seleccionesActuales = [...prev[categoria]]

      if (checked) {
        // Si ya alcanzó el límite, no permitir más selecciones
        if (seleccionesActuales.length >= limitesPorCategoria[categoria].maximo) {
          return prev
        }
        return {
          ...prev,
          [categoria]: [...seleccionesActuales, candidatoId],
        }
      } else {
        return {
          ...prev,
          [categoria]: seleccionesActuales.filter((id) => id !== candidatoId.toString()),
        }
      }
    })
  }

  // Manejar la abstención en una categoría
  const handleAbstencion = (categoria: Categoria, abstenerse: boolean) => {
    // Actualizar el estado de abstención
    setAbstenciones((prev) => ({
      ...prev,
      [categoria]: abstenerse,
    }))

    // Si se abstiene, limpiar las selecciones de esa categoría
    if (abstenerse) {
      setSelecciones((prev) => ({
        ...prev,
        [categoria]: [],
      }))
    }
  }

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
    return categorias.every((categoria) => categoriaEsValida(categoria));
  }

  // Abrir modal de confirmación
  const confirmarVoto = () => {
    setModalConfirmacion(true)
  }

  // Emitir voto
  const emitirVoto = async () => {
    if (!asambleistaSeleccionado) return

    const votos: VotoCategoria[] = categorias.map((categoria) => {
      if (abstenciones[categoria]) {
        return {
          categoria: categoria,
          abstencion: true,
        }
      } else {
        return {
          categoria: categoria,
          idcandidatos: selecciones[categoria].map((id) => parseInt(id))
        }
      }
    })

    const data: VotosBack = {
      idasambleista: parseInt(asambleistaSeleccionado),
      votos: votos
    }

    try {
      //console.log(data);
      await agregarVoto(data)

      // Reiniciar selecciones y abstenciones
      setSelecciones({
        "Docentes Principales": [],
        "Docentes Asociados": [],
        "Docentes Auxiliares": [],
        "Estudiantes": [],
      });
      setAbstenciones({
        "Docentes Principales": false,
        "Docentes Asociados": false,
        "Docentes Auxiliares": false,
        "Estudiantes": false,
      });
      setAsambleistaSeleccionado("");
      setModalConfirmacion(false);
    } catch (error) {
      console.error("Error al enviar los datos", error)
    }
  }


  const todasEnAbstencion = categorias.every(
    (categoria) => abstenciones[categoria]
  );

  return (
    <main className="grid grid-cols-1 gap-6">
      <div className="flex flex-col xl:grid xl:grid-cols-4 gap-4">
        {/* Sección de Votación */}
        <Card className="col-span-1 flex flex-col gap-2 border-1 border-[var(--border-color)] dark:border-stone-700 p-2">
          <CardHeader className="p-0">
            <CardTitle className="flex justify-center items-center bg-[var(--bg-title)] dark:bg-black py-3 rounded-sm">
              Votación
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-4">
              <div className="space-y-4">
                <Label htmlFor="asambleista">Lista de asambleístas</Label>
                <Select
                  value={asambleistaSeleccionado}
                  onValueChange={setAsambleistaSeleccionado}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Asambleísta" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {loadingAsambleista ? (
                      <SelectItem key={"loading"} value="loading-data">
                        <LoaderCircle className="animate-spin"></LoaderCircle>
                        Cargando datos...
                      </SelectItem>
                    ) : (
                      asambleistas.map((asambleista: AsambleistaBack) => (
                        <SelectItem
                          key={asambleista.idasambleista}
                          value={asambleista.idasambleista.toString()}
                          disabled={asambleista.ha_votado}
                        >
                          {asambleista.apellido}, {asambleista.nombre}
                          {asambleista.ha_votado && "(Ya votó)"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {todasEnAbstencion && (
                <div className="flex gap-3 items-center text-sm text-slate-500 p-2 rounded-md border-1 border-slate-300">
                  <Info className="h-5 w-5" />
                  <p>Se ha abstenido de todas las categorías.</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={confirmarVoto}
                  disabled={!puedeEmitirVoto()}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer flex-1 py-4"
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
            <CardTitle className="flex justify-center items-center bg-[var(--bg-title)] dark:bg-black py-3 rounded-sm">
              Candidatos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              defaultValue="Docentes Principales"
              value={categoriaActiva}
              onValueChange={(value) => setCategoriaActiva(value as Categoria)}
            >
              <TabsList className="grid grid-cols-2 gap-2 h-20 xl:grid-cols-4 xl:gap-4 w-full xl:h-10">
                {categorias.map((categoria) => (
                  <TabsTrigger
                    key={categoria}
                    value={categoria}
                    className="rounded-md border-1 border-[var(--text-color)]/15 cursor-pointer hover:bg-stone-300/40 dark:hover:bg-stone-700"
                  >
                    {categoria}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categorias.map((categoria) => (
                <TabsContent
                  key={categoria}
                  value={categoria}
                  className="p-4 bg-[var(--bg-doc-principales)]/50 dark:bg-black dark:text-white/90 rounded-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm">
                      {abstenciones[categoria] && (
                        <span className="text-gray-500 italic dark:text-stone-300">
                          Abstención seleccionada
                        </span>
                      )}
                      {
                        !abstenciones[categoria] && (
                          <div className="text-gray-500 mt-1 dark:text-stone-400">
                            Rango: {limitesPorCategoria[categoria].minimo} -{" "}
                            {limitesPorCategoria[categoria].maximo} candidatos
                          </div>
                        )
                      }
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
                      <Label htmlFor={`abstencion-${categoria}`}>
                        Abstención
                      </Label>
                    </div>
                  </div>

                  <ScrollArea className="h-60 w-full">
                    {loadingCandidato ? (
                      <div className="flex flex-col gap-4 items-center justify-center h-56 text-stone-600">
                        <LoaderCircle className="animate-spin"></LoaderCircle>
                        Cargando datos...
                      </div>
                    ) : candidatos.length === 0 ? (
                      <div className="flex items-center justify-center h-56 text-stone-600">
                        No hay candidatos
                      </div>
                    ) : (
                      <div
                        className={
                          abstenciones[categoria]
                            ? "opacity-50 pointer-events-none grid grid-cols-4 gap-2"
                            : "grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 xl:gap-4 xl:grid-cols-4"
                        }
                      >
                        {[...Array(4)].map((_, index) => {
                          const candidatosOrdenados = getCandidatosPorCategoria(rankingVotos, categoria)
                            .slice()
                            .sort((a, b) => a.codigo_facultad.localeCompare(b.codigo_facultad));
                          const candidatosPorColumna = candidatosOrdenados.length / 4; // MODIFICAR PARA UN FUTURO
                          const inicio = index * candidatosPorColumna;
                          const fin = inicio + candidatosPorColumna;
                          const candidatosColumna = candidatosOrdenados.slice(inicio, fin);
                          return (
                            <div key={index}>
                              {/* Encabezado */}
                              <div className="font-semibold text-sm flex w-full">
                                <div className="w-6 text-center inline-block mr-2 border-stone-600/50 border-b pb-1 mb-1">
                                  Fac.
                                </div>
                                <span className="border-stone-600/50 border-b pb-1 mb-1 w-full">
                                  Apellidos y Nombres
                                </span>
                              </div>

                              {/* Candidatos en esta columna */}
                              {candidatosColumna.map((candidato) => (
                                <div
                                  key={candidato.idcandidato}
                                  className="flex items-center space-x-2 py-2 border-b border-stone-600/50"
                                >
                                  <div className="w-6 text-center font-medium">
                                    {candidato.codigo_facultad}
                                  </div>
                                  <Checkbox
                                    id={candidato.idcandidato.toString()}
                                    checked={selecciones[categoria].includes(
                                      candidato.idcandidato.toString()
                                    )}
                                    onCheckedChange={(checked) =>
                                      handleSeleccionCandidato(
                                        categoria,
                                        candidato.idcandidato.toString(),
                                        checked === true
                                      )
                                    }
                                    disabled={
                                      abstenciones[categoria] ||
                                      (!selecciones[categoria].includes(
                                        candidato.idcandidato.toString()
                                      ) &&
                                        selecciones[categoria].length >=
                                          limitesPorCategoria[categoria].maximo)
                                    }
                                    className="dark:text-black dark:border-white"
                                  />
                                  <Label
                                    htmlFor={candidato.idcandidato.toString()}
                                    className="cursor-pointer line-clamp-1"
                                  >
                                    {candidato.nombre_candidato}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>

                    )}
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Sección de Resultados */}
        <Card className="col-span-4 flex-flex-col gap-2 border-1 border-[var(--border-color)] dark:border-stone-700 p-2">
          <CardHeader className="p-0">
            <CardTitle className="flex justify-center items-center bg-[var(--bg-title)] dark:bg-black py-3 rounded-sm">
              Resultados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <RankingVotos ></RankingVotos>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmación */}
      <Dialog open={modalConfirmacion} onOpenChange={setModalConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Votación</DialogTitle>
            <DialogDescription>
              Por favor confirme su selección de candidatos:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {categorias.map((categoria) => {
              const candidatosSeleccionados = selecciones[categoria]
                .map((idcandidato) =>
                  candidatos.find(
                    (c) => c.idcandidato.toString() === idcandidato
                  )
                )
                .filter(Boolean) as CandidatoBack[];

              return (
                <div key={categoria} className="mb-4">
                  <h4 className="font-medium">{categoria}:</h4>
                  {abstenciones[categoria] ? (
                    <p className="pl-5 mt-1 italic text-gray-500">Abstención</p>
                  ) : (
                    <ul className="list-none pl-5 mt-1">
                      {candidatosSeleccionados.map((candidato) => (
                        <li
                          key={candidato.idcandidato}
                          className="flex items-center gap-2"
                        >
                          <span className="font-medium w-6">
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
              onClick={() => setModalConfirmacion(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={emitirVoto}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar Voto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
