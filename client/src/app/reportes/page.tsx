"use client"
import { ReportesPDF } from "@/components/reportes";
import { ToggleDarkMode } from "@/components/ToggleDarkMode";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Reportes() {
  useDarkMode();
  const [navigate, setNavigate] = useState(false)
  
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      redirect("/");
    }
  }, []);

  if (navigate) return redirect("/about")

  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-8 p-8 xl:overflow-y-hidden">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Reportes del Proceso de Votación</h2>
        <Button variant={"outline"} className="cursor-pointer" onClick={() => setNavigate(!navigate)}>Ir a inicio</Button>
      </div>
      <ReportesPDF />
      <ToggleDarkMode></ToggleDarkMode>
    </div>
  );
}
