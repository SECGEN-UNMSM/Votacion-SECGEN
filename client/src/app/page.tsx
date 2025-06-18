"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginFields } from "@/lib/types";
import { useState } from "react";
import { redirect } from "next/navigation";
import { useDarkMode } from "@/hooks/useDarkMode";
import { ToggleDarkMode } from "@/components/ToggleDarkMode";
import Image from "next/image";

export default function LoginPage() {
  useDarkMode();
  const [navigate, setNavigate] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<LoginFields>();

  {
    /*Verificación de credenciales */
  }
  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    if (data.username === "admin" && data.password === "admin") {
      localStorage.setItem(
        "auth-token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ2MzMwMzE3LCJpYXQiOjE3NDYzMjk0MTcsImp0aSI6IjNlZjc5YzJhYjU0NjQyMzM4NjdlODE1ZjlkMGQ1NGM3IiwidXNlcl9pZCI6MX0.YblC_GXYIabI5LZgUuPw33o31VqP6en0iw8Z_wYWgT0"
      );
      setNavigate(true);
    } else {
      toast.error("¡Error! Verifica tus credenciales.");
    }

    reset();
  };

  if (navigate) return redirect("/about");

  return (
    <>
      <Toaster></Toaster>
      <div className="relative isolate w-screen h-screen overflow-x-hidden flex items-center justify-center gap-8 p-8 xl:overflow-y-hidden before:absolute before:inset-0 before:z-[-1] before:bg-[url(/Fondo.png)] before:bg-cover before:bg-center before:opacity-50 after:absolute after:inset-0 after:z-[-1] after:bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%)]">
        {/*linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%) */}
        <div className="flex gap-20 items-center z-10">
          <Card className="w-[386px] px-6 py-9">
            <CardHeader className="flex justify-center items-center bg-[var(--bg-title)] dark:bg-black py-2 rounded-md">
              <h2 className="text-center font-bold">Sistema de Votación</h2>
            </CardHeader>
            <CardContent>
              <form action="" className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <Label>Nombre de Usuario</Label>
                    <input
                      type="text"
                      id="username"
                      {...register("username", {
                        required: {
                          value: true,
                          message: "El nombre de usuario requerido",
                        },
                        pattern: {
                          value: /^[\w.-]+$/,
                          message: "No se permiten espacios.",
                        },
                      })}
                      placeholder="Escribe tu nombre de usuario"
                      className="border-2 py-2 px-3 rounded-lg text-md"
                    />
                    {errors.username && (
                      <span className="text-sm text-red-700 ml-2">
                        {errors.username.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Contraseña</Label>
                    <input
                      type="password"
                      id="password"
                      {...register("password", {
                        required: {
                          value: true,
                          message: "La constraseña es requerida.",
                        },
                      })}
                      placeholder="Escribe tu contraseña"
                      className="border-2 py-2 px-3 rounded-lg text-md"
                    />
                    {errors.password && (
                      <span className="text-sm text-red-700 ml-2">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-[var(--bg-button-success)] mt-8 w-full hover:bg-[var(--bg-button-success)]/80 cursor-pointer "
                >
                  Iniciar
                </Button>
              </form>
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
