import React, { useState, useRef } from "react";
import { baseURL } from "@/api/api";
import Swal from "sweetalert2";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useAsambleistas } from "@/hooks/useAsambleistas";
import { useCandidatos } from "@/hooks/useCandidatos";
import { useVotos } from "@/hooks/useVotos";

export const PanelCargaMasiva: React.FC = () => {
  const [loadingAsambleistas, setLoadingAsambleistas] = useState(false);
  const [loadingCedula, setLoadingCedula] = useState(false);
  const [asambleistasUploaded, setAsambleistasUploaded] = useState(false);
  const [cedulaUploaded, setCedulaUploaded] = useState(false);
  const { isDark } = useTheme();
  const { fetchAsambleistas } = useAsambleistas();
  const { fetchCandidatos } = useCandidatos();
  const { fetchRankingVotos } = useVotos();

  const fileInputAsambleistasRef = useRef<HTMLInputElement>(null);
  const fileInputCedulaRef = useRef<HTMLInputElement>(null);

  const handleUploadAsambleistas = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("archivo", file);

    setLoadingAsambleistas(true);

    try {
      const response = await globalThis.fetch(`${baseURL}/asambleistas/importar-excel`, {
        method: "POST",
        body: formData,
      });
      
      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error(`Error del servidor (${response.status}): El backend retornó HTML en lugar de JSON. Verifica si el servidor backend está actualizado y ejecutándose.`);
      }

      if (response.ok && data.ok) {
        setAsambleistasUploaded(true);
        await fetchAsambleistas();
        await fetchRankingVotos();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: data.message,
          theme: isDark ? "dark" : "light",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error al procesar el archivo.",
          theme: isDark ? "dark" : "light",
        });
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: error.message || "Error de red o no hay conexión con el servidor.",
        theme: isDark ? "dark" : "light",
      });
    } finally {
      setLoadingAsambleistas(false);
      if (fileInputAsambleistasRef.current) fileInputAsambleistasRef.current.value = "";
    }
  };

  const handleUploadCedula = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("archivo", file);

    setLoadingCedula(true);

    try {
      const response = await globalThis.fetch(`${baseURL}/candidatos/importar-cedula`, {
        method: "POST",
        body: formData,
      });
      
      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error(`Error del servidor (${response.status}): El backend retornó HTML en lugar de JSON. Verifica si el servidor backend está actualizado y ejecutándose.`);
      }

      if (response.ok && data.ok) {
        setCedulaUploaded(true);
        await fetchCandidatos();
        await fetchRankingVotos();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: data.message,
          theme: isDark ? "dark" : "light",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error al importar cédula",
          theme: isDark ? "dark" : "light",
        });
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: error.message || "Error de red o no hay conexión con el servidor.",
        theme: isDark ? "dark" : "light",
      });
    } finally {
      setLoadingCedula(false);
      if (fileInputCedulaRef.current) fileInputCedulaRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full p-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-2">
        <h4 className="font-semibold tracking-tight">Carga masiva mediante Excel</h4>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          Seleccione el archivo Excel (.xls, .xlsx) correspondiente para actualizar la base de datos. Los registros anteriores serán reemplazados de manera permanente.
        </p>
      </div>

      <div className="flex flex-col gap-4 p-5 border rounded-lg bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-base leading-none tracking-tight">Lista de Asambleístas</h4>
            {asambleistasUploaded && (
              <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 animate-in fade-in zoom-in-95 duration-300">
                Subido
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Padrón oficial de asambleístas con nombres y apellidos.</p>
        </div>
        <input
          type="file"
          ref={fileInputAsambleistasRef}
          onChange={handleUploadAsambleistas}
          accept=".xls,.xlsx"
          className="hidden"
        />
        <Button
          onClick={() => fileInputAsambleistasRef.current?.click()}
          disabled={loadingAsambleistas}
          className="w-full mt-2 cursor-pointer"
        >
          {loadingAsambleistas ? "Importando datos..." : "Cargar Asambleístas"}
        </Button>
      </div>

      <div className="flex flex-col gap-4 p-5 border rounded-lg bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-base leading-none tracking-tight">Cédula de Sufragio</h4>
            {cedulaUploaded && (
              <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 animate-in fade-in zoom-in-95 duration-300">
                Subido
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Documento Excel con los candidatos categorizados.</p>
        </div>
        <input
          type="file"
          ref={fileInputCedulaRef}
          onChange={handleUploadCedula}
          accept=".xls,.xlsx"
          className="hidden"
        />
        <Button
          onClick={() => fileInputCedulaRef.current?.click()}
          disabled={loadingCedula}
          className="w-full mt-2 cursor-pointer"
        >
          {loadingCedula ? "Procesando cédula..." : "Cargar Cédula de Sufragio"}
        </Button>
      </div>
    </div>
  );
};
