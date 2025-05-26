"use client"
import { ReportesPDF } from "@/components/reportes";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-8 p-8">
      <h2 className="font-bold text-xl">Reportes del Proceso de Votación</h2>
      <ReportesPDF />
    </div>
  );
}
