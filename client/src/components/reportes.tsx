"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, FileText, Eye} from "lucide-react";
import { categorias } from "@/lib/data";

/*
const categorias: Categoria[] = [
  { id: "cat_001", nombre: "Docentes Principales" },
  { id: "cat_002", nombre: "Docentes Asociados" },
  { id: "cat_003", nombre: "Docentes Auxiliares" },
  { id: "cat_004", nombre: "Estudiantes" },
];
*/

export function ReportesPDF() {
  const [tipoReporte, setTipoReporte] = useState<string>("general");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState<boolean>(false);


  const construirUrlReporte = () => {
    const params = new URLSearchParams({
      procesoId: "proc_001",
      tipo: tipoReporte,
      colorPrimario: "#28A745",
      colorSecundario: "#FFFFFF",
      fuente: "Sora",
      tamanoFuente: "12",
    });

    if (tipoReporte === "categoria" && categoriaSeleccionada) {
      params.append("categoriaId", categoriaSeleccionada);
    }

    return `/api/reportes/pdf?${params.toString()}`;
  };

  const generarVistaPrevia = async () => {
    setIsLoading(true);
    try {
      const url = construirUrlReporte();
      setPdfUrl(url);
      setMostrarVistaPrevia(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al generar la vista previa");
    } finally {
      setIsLoading(false);
    }
  };

  const descargarReporte = async () => {
    setIsLoading(true);
    try {
      const url = construirUrlReporte();
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al generar el reporte");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `reporte-votacion-${tipoReporte}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al descargar el reporte");
    } finally {
      setIsLoading(false);
    }
  };

  const puedeGenerar = 
    tipoReporte === "general" ||
    (tipoReporte === "categoria" && categoriaSeleccionada);

  return (
    <div className=" h-screen grid grid-cols-1 grid-rows-3 xl:grid-cols-4 gap-6 ">
      {/* Panel de configuración */}
      <div className="row-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Configuración del Reporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Tipo de reporte */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Tipo de Reporte</Label>
              <RadioGroup value={tipoReporte} onValueChange={setTipoReporte}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general">Reporte General</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="categoria" id="categoria" />
                  <Label htmlFor="categoria">Reporte por Categoría</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Selección de categoría */}
            {tipoReporte === "categoria" && (
              <div className="space-y-2">
                <Label htmlFor="categoria-select" className="pb-4 pt-8">Categoría</Label>
                <Select
                  value={categoriaSeleccionada}
                  onValueChange={setCategoriaSeleccionada}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria, index) => (
                      <SelectItem key={index} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={generarVistaPrevia}
                disabled={!puedeGenerar || isLoading}
                className="flex items-center gap-2 bg-[var(--bg-button-success)] hover:bg-[var(--bg-button-success)] hover:opacity-90 cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                {isLoading ? "Generando..." : "Vista Previa"}
              </Button>

              <Button
                variant="outline"
                onClick={descargarReporte}
                disabled={!puedeGenerar || isLoading}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vista previa del PDF */}
      <div className="xl:col-span-3 row-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Vista Previa del Reporte</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            {mostrarVistaPrevia && pdfUrl ? (
              <div className="w-full h-[524px] border rounded-lg overflow-hidden">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="Vista previa del reporte PDF"
                  style={{ border: "none" }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[98%] border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Vista Previa del PDF</p>
                  <p className="text-sm">
                    Configure las opciones y presione en "Vista Previa" para
                    visualizar el reporte.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
