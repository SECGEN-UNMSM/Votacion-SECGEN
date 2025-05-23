"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import type { Asambleista, Candidato, Categoria } from "@/lib/types"
import { asambleistasIniciales, candidatosIniciales, categorias } from "@/lib/data"
import { limitesPorCategoria } from "@/lib/types"

export default function SistemaVotacion() {
  const [asambleistas, setAsambleistas] = useState<Asambleista[]>(asambleistasIniciales)
  const [candidatos, setCandidatos] = useState<Candidato[]>(candidatosIniciales)
  const [asambleistaSeleccionado, setAsambleistaSeleccionado] = useState<string>("")
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("Docentes Principales")
  const [selecciones, setSelecciones] = useState<Record<Categoria, string[]>>({
    "Docentes Principales": [],
    "Docentes Asociados": [],
    "Docentes Auxiliares": [],
    Estudiantes: [],
  })
  const [abstenciones, setAbstenciones] = useState<Record<Categoria, boolean>>({
    "Docentes Principales": false,
    "Docentes Asociados": false,
    "Docentes Auxiliares": false,
    Estudiantes: false,
  })
  const [procesoTitulo, setProcesoTitulo] = useState<string>("Proceso 2025-08-10")
  const [modalConfirmacion, setModalConfirmacion] = useState<boolean>(false)

  // Filtrar candidatos por categoría
  const getCandidatosPorCategoria = (categoria: Categoria) => {
    return candidatos.filter((candidato) => candidato.categoria === categoria)
  }

  // Manejar la selección de un candidato
  const handleSeleccionCandidato = (categoria: Categoria, candidatoId: string, checked: boolean) => {
    // Si la categoría está en abstención, no permitir seleccionar candidatos
    if (abstenciones[categoria]) return

    setSelecciones((prev) => {
      const seleccionesActuales = [...prev[categoria]]

      if (checked) {
        // Si ya alcanzó el límite, no permitir más selecciones
        if (seleccionesActuales.length >= limitesPorCategoria[categoria]) {
          return prev
        }
        return {
          ...prev,
          [categoria]: [...seleccionesActuales, candidatoId],
        }
      } else {
        return {
          ...prev,
          [categoria]: seleccionesActuales.filter((id) => id !== candidatoId),
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

  // Verificar si se cumple con los requisitos para habilitar el botón de emitir voto
  const puedeEmitirVoto = () => {
    if (!asambleistaSeleccionado) return false

    // Verificar que no se haya abstenido en todas las categorías
    const todasAbstenciones = categorias.every((categoria) => abstenciones[categoria])
    if (todasAbstenciones) return false

    // Verificar que para cada categoría, o bien se haya abstenido, o bien haya seleccionado
    // la cantidad correcta de candidatos
    return categorias.every(
      (categoria) => abstenciones[categoria] || selecciones[categoria].length === limitesPorCategoria[categoria],
    )
  }

  // Abrir modal de confirmación
  const confirmarVoto = () => {
    setModalConfirmacion(true)
  }

  // Emitir voto
  const emitirVoto = () => {
    if (!asambleistaSeleccionado) return

    // Actualizar conteo de votos para candidatos
    const nuevosCandidatos = [...candidatos]

    categorias.forEach((categoria) => {
      // Solo contar votos en categorías donde no se abstuvo
      if (!abstenciones[categoria]) {
        selecciones[categoria].forEach((candidatoId) => {
          const candidatoIndex = nuevosCandidatos.findIndex((c) => c.id === candidatoId)
          if (candidatoIndex !== -1) {
            nuevosCandidatos[candidatoIndex] = {
              ...nuevosCandidatos[candidatoIndex],
              votos: nuevosCandidatos[candidatoIndex].votos + 1,
            }
          }
        })
      }
    })

    setCandidatos(nuevosCandidatos)

    // Marcar asambleísta como que ya votó
    const nuevosAsambleistas = asambleistas.map((asambleista) =>
      asambleista.id === asambleistaSeleccionado ? { ...asambleista, haVotado: true } : asambleista,
    )
    setAsambleistas(nuevosAsambleistas)

    // Reiniciar selecciones y abstenciones
    setSelecciones({
      "Docentes Principales": [],
      "Docentes Asociados": [],
      "Docentes Auxiliares": [],
      Estudiantes: [],
    })
    setAbstenciones({
      "Docentes Principales": false,
      "Docentes Asociados": false,
      "Docentes Auxiliares": false,
      Estudiantes: false,
    })
    setAsambleistaSeleccionado("")
    setModalConfirmacion(false)
  }

  // Obtener el color de fondo para cada categoría
  const getColorCategoria = (categoria: Categoria) => {
    switch (categoria) {
      case "Docentes Principales":
        return "bg-docentes-principales"
      case "Docentes Asociados":
        return "bg-docentes-asociados"
      case "Docentes Auxiliares":
        return "bg-docentes-auxiliares"
      case "Estudiantes":
        return "bg-estudiantes"
      default:
        return "bg-gray-100"
    }
  }

  // Obtener el nombre del candidato por ID
  const getNombreCandidato = (id: string) => {
    const candidato = candidatos.find((c) => c.id === id)
    return candidato ? candidato.nombre : ""
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección de Votación */}
        <Card>
          <CardHeader className="bg-muted">
            <CardTitle>Votación</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del proceso</Label>
                <Input id="titulo" value={procesoTitulo} onChange={(e) => setProcesoTitulo(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asambleista">Lista de asambleístas</Label>
                <Select value={asambleistaSeleccionado} onValueChange={setAsambleistaSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Asambleísta" />
                  </SelectTrigger>
                  <SelectContent>
                    {asambleistas.map((asambleista) => (
                      <SelectItem key={asambleista.id} value={asambleista.id} disabled={asambleista.haVotado}>
                        {asambleista.nombre} {asambleista.haVotado && "(Ya votó)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" onClick={() => setAsambleistaSeleccionado("")}>
                  No emitir voto
                </Button>
                <Button
                  onClick={confirmarVoto}
                  disabled={!puedeEmitirVoto()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Emitir voto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Candidatos */}
        <Card>
          <CardHeader className="bg-muted">
            <CardTitle>Candidatos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              defaultValue="Docentes Principales"
              value={categoriaActiva}
              onValueChange={(value) => setCategoriaActiva(value as Categoria)}
            >
              <TabsList className="grid grid-cols-4 w-full">
                {categorias.map((categoria) => (
                  <TabsTrigger key={categoria} value={categoria}>
                    {categoria}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categorias.map((categoria) => (
                <TabsContent key={categoria} value={categoria} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm">
                      {!abstenciones[categoria] ? (
                        <>
                          Seleccione {limitesPorCategoria[categoria]} candidato
                          {limitesPorCategoria[categoria] > 1 ? "s" : ""} ({selecciones[categoria].length}/
                          {limitesPorCategoria[categoria]})
                        </>
                      ) : (
                        <span className="text-gray-500 italic">Abstención seleccionada</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={abstenciones[categoria]}
                        onCheckedChange={(checked) => handleAbstencion(categoria, checked)}
                        id={`abstencion-${categoria}`}
                      />
                      <Label htmlFor={`abstencion-${categoria}`}>Abstención</Label>
                    </div>
                  </div>

                  <div className={abstenciones[categoria] ? "opacity-50 pointer-events-none" : ""}>
                    {getCandidatosPorCategoria(categoria).map((candidato, index) => (
                      <div key={candidato.id} className="flex items-center space-x-2 py-2 border-b">
                        <div className="w-6 text-center font-medium">{index + 1}</div>
                        <Checkbox
                          id={candidato.id}
                          checked={selecciones[categoria].includes(candidato.id)}
                          onCheckedChange={(checked) =>
                            handleSeleccionCandidato(categoria, candidato.id, checked === true)
                          }
                          disabled={
                            abstenciones[categoria] ||
                            (!selecciones[categoria].includes(candidato.id) &&
                              selecciones[categoria].length >= limitesPorCategoria[categoria])
                          }
                        />
                        <Label htmlFor={candidato.id} className="cursor-pointer">
                          {candidato.nombre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Resultados */}
      <Card>
        <CardHeader className="bg-muted">
          <CardTitle className="text-center">Resultados</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {categorias.map((categoria) => {
              // Ordenar candidatos por votos (descendente)
              const candidatosOrdenados = [...getCandidatosPorCategoria(categoria)].sort((a, b) => b.votos - a.votos)

              return (
                <div key={categoria} className={`${getColorCategoria(categoria)} rounded-lg p-4 min-h-[200px]`}>
                  <h3 className="font-bold mb-4">{categoria}</h3>
                  <div className="space-y-2">
                    {candidatosOrdenados.map((candidato) => (
                      <div key={candidato.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium w-6">{candidato.codigoFacultad}.</span>
                          <span>{candidato.nombre}</span>
                        </div>
                        <span className="font-bold">{candidato.votos} votos</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Confirmación */}
      <Dialog open={modalConfirmacion} onOpenChange={setModalConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Votación</DialogTitle>
            <DialogDescription>Por favor confirme su selección de candidatos:</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {categorias.map((categoria) => {
              const candidatosSeleccionados = selecciones[categoria]
                .map((id) => candidatos.find((c) => c.id === id))
                .filter(Boolean) as Candidato[]

              return (
                <div key={categoria} className="mb-4">
                  <h4 className="font-medium">{categoria}:</h4>
                  {abstenciones[categoria] ? (
                    <p className="pl-5 mt-1 italic text-gray-500">Abstención</p>
                  ) : (
                    <ul className="list-none pl-5 mt-1">
                      {candidatosSeleccionados.map((candidato) => (
                        <li key={candidato.id} className="flex items-center gap-2">
                          <span className="font-medium w-6">{candidato.codigoFacultad}.</span>
                          <span>{candidato.nombre}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalConfirmacion(false)}>
              Cancelar
            </Button>
            <Button onClick={emitirVoto} className="bg-green-600 hover:bg-green-700">
              Confirmar Voto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
