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
import { Download, FileText, Eye, Loader2} from "lucide-react";
import { categorias } from "@/lib/data";
import { baseURL } from "@/api/api";

export function ReportesPDF() {
  const [tipoReporte, setTipoReporte] = useState<string>("general");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPdfUrl("");
    setError(null);
    setMostrarVistaPrevia(false);
  }, [tipoReporte, categoriaSeleccionada]);

  const construirUrlReporte = () => {
    setError(null); // Limpiar errores anteriores
    if (tipoReporte === "categoria") {
      if (!categoriaSeleccionada) {
        console.warn(
          "Se intentó construir URL para reporte de categoría sin categoría seleccionada."
        );
        return null;
      }
      // La categoría va en la ruta
      return `${baseURL}/exportar-pdf/${encodeURIComponent(
        categoriaSeleccionada
      )}`;
    } else if (tipoReporte === "general") {
      const params = new URLSearchParams({
        procesoId: "proc_001",
        tipo: tipoReporte,
        colorPrimario: "#28A745",
        colorSecundario: "#FFFFFF",
        fuente: "Sora",
        tamanoFuente: "12",
      });

      return null
    }

    return null
  };

  const generarVistaPrevia = async () => {
    setIsLoading(true);
    const url = construirUrlReporte();
    if (!url) {
      return;
    }

    setIsLoading(true);
    setMostrarVistaPrevia(false);
    setPdfUrl("");
    try {
      // Para la vista previa, simplemente establecemos la URL.
      // El iframe se encargará de hacer la petición GET.
      // Es importante que el backend devuelva 'Content-Type': 'application/pdf'
      // y NO 'Content-Disposition': 'attachment; ...' para la vista previa,
      // o que el navegador pueda manejar 'attachment' dentro de un iframe.
      // Si el 'Content-Disposition' es 'attachment', el iframe intentará descargar.
      // Una opción es tener un endpoint diferente para la vista previa o un query param.
      // Ejemplo: `${url}?vistaPrevia=true` y que el backend omita Content-Disposition.
      // Por simplicidad, asumimos que el navegador maneja bien el PDF en el iframe.

      // Validación básica de la respuesta para la vista previa (opcional pero recomendado)
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error del servidor: ${response.status} - ${
            errorText || "No se pudo cargar la vista previa"
          }`
        );
      }
      if (response.headers.get("Content-Type")?.includes("application/pdf")) {
        setPdfUrl(url); // La URL es válida y parece ser un PDF
        setMostrarVistaPrevia(true);
      } else {
        throw new Error(
          "La respuesta no es un archivo PDF válido para la vista previa."
        );
      }
    } catch (err) {
      console.error("Error al generar vista previa:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Ocurrió un error desconocido.";
      setError(`Error al generar la vista previa: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const descargarReporte = async () => {
    const url = construirUrlReporte();
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error del servidor: ${response.status} - ${
            errorText || "No se pudo generar el reporte"
          }`
        );
      }

      const disposition = response.headers.get("content-disposition");
      let filename = `reporte-votacion-${tipoReporte}-${Date.now()}.pdf`;

      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }
      // Si la categoría está seleccionada y es reporte por categoría, usamos el nombre del backend
      if (tipoReporte === "categoria" && categoriaSeleccionada) {
        filename = `reporte_${categoriaSeleccionada.replace(/\s+/g, "_")}.pdf`;
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Error al descargar reporte:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Ocurrió un error desconocido.";
      setError(`Error al descargar el reporte: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const puedeGenerar = 
    tipoReporte === "general" ||
    (tipoReporte === "categoria" && !!categoriaSeleccionada);

    return (
      <div className="h-screen grid grid-cols-1 grid-rows-[auto,1fr] xl:grid-cols-4 gap-6 p-4 md:p-6">
        {/* Panel de configuración */}
        <div className="row-span-1 xl:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Configuración del Reporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label className="text-base font-medium">Tipo de Reporte</Label>
                <RadioGroup
                  value={tipoReporte}
                  onValueChange={(value) => {
                    setTipoReporte(value);
                    setCategoriaSeleccionada("");
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" disabled />{" "}
                    {/* Deshabilitado temporalmente */}
                    <Label htmlFor="general">
                      Reporte General (No disponible)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="categoria" id="categoria" />
                    <Label htmlFor="categoria">Reporte por Categoría</Label>
                  </div>
                </RadioGroup>
              </div>

              {tipoReporte === "categoria" && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="categoria-select">Categoría</Label>
                  <Select
                    value={categoriaSeleccionada}
                    onValueChange={setCategoriaSeleccionada}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(
                        (
                          cat,
                          index
                        ) => (
                          <SelectItem key={index} value={cat}>
                            {cat}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <Button
                  onClick={generarVistaPrevia}
                  disabled={!puedeGenerar || isLoading}
                  className="flex items-center justify-center gap-2 bg-[var(--bg-button-success)] hover:bg-[var(--bg-button-success)] hover:opacity-90 cursor-pointer"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Eye className="h-4 w-4" />
                  Vista Previa
                </Button>

                <Button
                  variant="outline"
                  onClick={descargarReporte}
                  disabled={!puedeGenerar || isLoading}
                  className="flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Vista previa del PDF */}
        <div className="xl:col-span-3 row-span-1 xl:row-span-1">
          <Card className="h-full min-h-[400px] xl:min-h-0">
            <CardHeader>
              <CardTitle>Vista Previa del Reporte</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-72px)]">
              {isLoading &&
                !pdfUrl && (
                  <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                  </div>
                )}
              {!isLoading && mostrarVistaPrevia && pdfUrl ? (
                <div className="w-full h-full border rounded-lg overflow-hidden">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    title="Vista previa del reporte PDF"
                    style={{ border: "none" }}
                  />
                </div>
              ) : (
                !isLoading && (
                  <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        Vista Previa del PDF
                      </p>
                      <p className="text-sm">
                        Configure las opciones y presione en "Vista Previa" para
                        visualizar el reporte.
                      </p>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
}
