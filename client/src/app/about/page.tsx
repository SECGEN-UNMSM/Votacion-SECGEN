"use client";

import { ToggleDarkMode } from "@/components/ToggleDarkMode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "@/hooks/useTheme";
import { useVotos } from "@/hooks/useVotos";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function About() {
  const [openDialog, setOpenDialog] = useState(false);
  const { isDark } = useTheme();
  const { reiniciarTodo } = useVotos();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      redirect("/");
    }
  }, []);

  // Iniciar un nuevo proceso de votación
  const iniciarVotacion = async () => {
    try {
      setOpenDialog(false);
      setTimeout(async () => {
        Swal.fire({
          title: "Iniciando proceso...",
          text: "Por favor, espera.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
          showConfirmButton: false,
          theme: isDark ? "dark" : "light",
        });

        try {
          await reiniciarTodo();

          Swal.fire({
            icon: "success",
            title: "Proceso iniciado!",
            text: `El proceso de votación ha sido iniciado exitosamente.`,
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#28A745",
            theme: isDark ? "dark" : "light",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Algo salió mal al reiniciar el proceso de votación.",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#dc3545",
            theme: isDark ? "dark" : "light",
          });
          console.error("Error al reiniciar todo:", error);
        }
      }, 300);
    } catch (error) {
      console.error("Error al iniciar la votación", error);
    }
  };

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
              <h2 className="text-center font-bold text-xl">
                Acerca de Nosotros
              </h2>
            </CardHeader>
            <CardContent className="flex gap-8 text-base">
              <div className="flex flex-col items-baseline gap-2 pr-2 border-r-2">
                <Button variant={"link"} disabled className="text-base">
                  Nosotros
                </Button>
                <Button
                  variant={"link"}
                  className="cursor-pointer text-base"
                  onClick={() => setOpenDialog(!openDialog)}
                >
                  Iniciar
                </Button>
                <Button
                  variant={"link"}
                  className="cursor-pointer text-base"
                  onClick={() => redirect("/home")}
                >
                  Votación
                </Button>
                <Button
                  variant={"link"}
                  className="cursor-pointer text-base"
                  onClick={() => redirect("/reportes")}
                >
                  Reportes
                </Button>
                <Button
                  className="mt-auto cursor-pointer text-red-700 text-base"
                  variant={"link"}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </div>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Iniciar el proceso de votación
                    </DialogTitle>
                    <DialogDescription className="text-[16px]">
                      Por favor, confirme que desea iniciar un nuevo proceso de
                      votación.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant={"outline"}
                      className="cursor-pointer text-[16px] px-4"
                      onClick={() => setOpenDialog(!openDialog)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant={"default"}
                      className="bg-[var(--bg-button-success)] hover:bg-[var(--bg-button-success)] hover:opacity-90 cursor-pointer text-[16px] px-4"
                      onClick={iniciarVotacion}
                    >
                      Aceptar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <section>
                <h4 className="font-semibold">
                  Sobre el Sistema de Votación del Comité Electoral
                </h4>
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
          <Image
            src="Logo_UNMSM.svg"
            width={320}
            height={320}
            alt="Logo UNMSM"
          />
        </div>
      </div>
      <ToggleDarkMode></ToggleDarkMode>
    </>
  );
}
