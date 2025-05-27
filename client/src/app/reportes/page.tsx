"use client"
import { ReportesPDF } from "@/components/reportes";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-8 p-8 xl:overflow-y-hidden">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Reportes del Proceso de Votación</h2>
        <Link href="/" className="border-1 border-stone-200 text-stone-700 rounded-md px-3 py-2 text-sm hover:bg-stone-100">Ir a inicio</Link>
      </div>
      <ReportesPDF />
    </div>
  );
}
