"use client"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function NotFound() {
  const [navigate, setNavigate] = useState(false)
  if (navigate) return redirect("/login")
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h3 className="font-bold text-3xl">404 | Página no encontrada</h3>
      <p className="my-4 text-stone-600">Lo sentimos, la página que buscas no existe.</p>
      <Button variant={"outline"} onClick={() => setNavigate(!navigate)}>Volver al inicio</Button>
    </div>
  )
}