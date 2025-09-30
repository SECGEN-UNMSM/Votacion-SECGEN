"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { redirect } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";

export function Navbar() {
  useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [navigate, setNavigate] = useState<boolean>(false);

  if (navigate) return redirect("/reportes");

  return (
    <header className="w-full flex justify-between items-center">
      <h4 className="font-bold text-xl select-none">
        Sistema de Votación del Comité Electoral
      </h4>
      <nav className="flex gap-4 items-center">
        <Button
          variant={"destructive"}
          className="cursor-pointer hover:opacity-80 text-lg px-6"
          onClick={() => setOpenModal(!openModal)}
        >
          Finalizar
        </Button>
      </nav>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Finalización del proceso de votación
            </DialogTitle>
            <DialogDescription className="text-[16px]">
              Por favor, confirme la finalización del proceso actual de
              votación.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"outline"}
              className="cursor-pointer text-[16px] px-4"
              onClick={() => setOpenModal(!openModal)}
            >
              Cancelar
            </Button>
            <Button
              variant={"default"}
              className="bg-[var(--bg-button-success)] hover:bg-[var(--bg-button-success)] hover:opacity-90 cursor-pointer text-[16px] px-4"
              onClick={() => setNavigate(!navigate)}
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
