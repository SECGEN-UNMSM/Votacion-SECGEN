"use client";

import { useState } from "react";
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
import { Download, FileText, Loader2, LoaderCircle } from "lucide-react";
import { baseURL } from "@/api/api";
import { useVotos } from "@/hooks/useVotos";
import RankingVotos from "./CardsRankingVotos/rankingVotos";
import toast, { Toaster } from "react-hot-toast";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import { listaCategorias } from "@/lib/types";

export function ReportesPDF() {
  const { loading: loadingRankingVotos } = useVotos();
  const [tipoReporte, setTipoReporte] = useState<string>("general");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log(tipoReporte, baseURL);
      return `${baseURL}/exportar-general-pdf/`;
    }

    return null;
  };

  const descargarReporte = async () => {
    const url = construirUrlReporte();
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await tauriFetch(url);

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
        if (matches?.[1]) {
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
      toast.success("Reporte en PDF generado.");
    } catch (err) {
      console.error("Error al descargar reporte:", err);
      toast.error("Error al descargar el reporte");
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
    <>
      <Toaster></Toaster>
      <div className="h-screen grid grid-cols-1 grid-rows-[auto,1fr] xl:grid-cols-4 gap-4 p-2 md:p-4">
        {/* Panel de configuración */}
        <div className="row-span-1 xl:col-span-1 space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Configuración del Reporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label className=" font-semibold text-lg">
                  Tipo de Reporte
                </Label>
                <RadioGroup
                  value={tipoReporte}
                  onValueChange={(value) => {
                    setTipoReporte(value);
                    setCategoriaSeleccionada("");
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />{" "}
                    {/* Deshabilitado temporalmente */}
                    <Label htmlFor="general" className="text-lg font-normal">
                      Reporte General
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="categoria" id="categoria" />
                    <Label htmlFor="categoria" className="text-lg font-normal">
                      Reporte por Categoría
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {tipoReporte === "categoria" && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="categoria-select text-[16px]">
                    Categoría
                  </Label>
                  <Select
                    value={categoriaSeleccionada}
                    onValueChange={setCategoriaSeleccionada}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full text-[16px]">
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {listaCategorias.map((cat, index) => (
                        <SelectItem
                          key={index}
                          value={cat}
                          className="text-[16px]"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={descargarReporte}
                  disabled={!puedeGenerar || isLoading}
                  className="flex items-center justify-center gap-2 cursor-pointer bg-[var(--bg-button-success)] hover:bg-[var(--bg-button-success)] hover:opacity-90 hover:text-white/90 text-white/90 text-lg py-4"
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
              <CardTitle className="text-lg">
                Vista del Ranking de Votos
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-72px)]">
              {!loadingRankingVotos ? (
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RankingVotos stateVisibility={true}></RankingVotos>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg text-stone-600">
                  <LoaderCircle className="animate-spin"></LoaderCircle>
                  <p>Cargando datos ...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
