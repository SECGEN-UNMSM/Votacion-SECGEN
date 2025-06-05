"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { redirect } from "next/navigation";
import { useDarkMode } from "@/hooks/useDarkMode";
import { ToggleDarkMode } from "./ToggleDarkMode";

export function Navbar() {
  const [] = useDarkMode();
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [navigate, setNavigate] = useState<boolean>(false)

  if (navigate) return redirect("/reportes")

  return (
    <header className="w-full flex justify-between items-center">
      <h4 className="font-bold">Sistema de votación</h4>
      <nav className="flex gap-4 items-center">
        <Button variant={"destructive"} className="cursor-pointer hover:opacity-80" onClick={() => setOpenModal(!openModal)}>
          Finalizar
        </Button>
      </nav>
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalización del proceso de votación</DialogTitle>
            <DialogDescription>
              Por favor, confirme la la finalización del proceso actual de
              votación.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"outline"} className="cursor-pointer" onClick={() => setOpenModal(!openModal)}>Cancelar</Button>
            <Button variant={"default"} className="bg-[var(--bg-button-success)] hover:bg-[var(--bg-button-success)] hover:opacity-90 cursor-pointer" onClick={() => setNavigate(!navigate)}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}