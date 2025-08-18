"use client";
import SistemaVotacion from "@/components/sistema-votacion";
import { Navbar } from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ToggleDarkMode } from "@/components/ToggleDarkMode";

export default function Home() {
  useTheme();
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      redirect("/");
    }
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-6 p-4">
      <Toaster></Toaster>
      <Navbar></Navbar>
      <SistemaVotacion />
      <ToggleDarkMode></ToggleDarkMode>
    </div>
  );
}
