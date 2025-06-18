"use client"

import { ToggleDarkMode } from "@/components/ToggleDarkMode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDarkMode } from "@/hooks/useDarkMode";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function About() {
  useDarkMode();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      redirect("/");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    redirect("/");
  };

  return (
    <>
      <div className="relative isolate w-screen h-screen overflow-x-hidden flex items-center justify-center gap-8 p-8 xl:overflow-y-hidden before:absolute before:inset-0 before:z-[-1] before:bg-[url(/Fondo.png)] before:bg-cover before:bg-center before:opacity-50 after:absolute after:inset-0 after:z-[-1] after:bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%)]">
        {/*linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%) */}
        <div className="flex gap-20 items-center z-10">
          <Card className="w-3xl px-6 py-9">
            <CardHeader className="flex justify-center items-center bg-[var(--bg-title)] py-2 rounded-md dark:bg-black">
              <h2 className="text-center font-bold">Acerca de Nosotros</h2>
            </CardHeader>
            <CardContent className="flex gap-8">
              <div className="flex flex-col gap-2 pr-4 border-r-2">
                <Button variant={"link"} disabled>
                  Nosotros
                </Button>
                <Button variant={"link"} className="cursor-pointer" onClick={() => redirect("/home")}>
                  Votación
                </Button>
                <Button variant={"link"} className="cursor-pointer" onClick={() => redirect("/reportes")}>
                  Reportes
                </Button>
                <Button className="mt-auto cursor-pointer text-red-700" variant={"link"} onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
              <section>
                <h4 className="font-semibold">Sobre el Sistema de Votación</h4>
                <p className="text-stone-700 mt-2 dark:text-stone-400">
                  El Sistema de Elecciones del Comité Electoral ha sido
                  desarrollado por la Unidad de Informática de la Secretaría
                  General de la Universidad Nacional Mayor de San Marcos.
                </p>
                <h4 className="font-semibold mt-6">Equipo de Desarrollo</h4>
                <ul className="text-stone-700 mt-2 pl-6 list-disc dark:text-stone-400">
                  <li>Patricio Julca, Vilberto</li>
                  <li>Román Suyo, André</li>
                  <li>Vera Alva, Miguel</li>
                </ul>
                <h4 className="font-semibold mt-6">Equipo de Supervisión</h4>
                <ul className="text-stone-700 mt-2 pl-6 list-disc dark:text-stone-400">
                  <li>Ing. Tomas Angeles Natividad (Encargado de la Unidad)</li>
                  <li>Ing. Billy Padilla Huaman</li>
                  <li>Ing. Delfin Urbando Ochoa</li>
                </ul>
                <h4 className="font-semibold mt-6">Objetivo del Sistema</h4>
                <p className="italic text-stone-700 mt-2 dark:text-stone-400">
                  Este sistema fue concebido para optimizar y transparentar el
                  proceso de elecciones del Comité Electoral UNMSM.
                </p>
              </section>
            </CardContent>
          </Card>
          <Image src="Logo_UNMSM.svg" width={320} height={320} alt="Logo UNMSM" />
        </div>
      </div>
      <ToggleDarkMode></ToggleDarkMode>
    </>
  );
}