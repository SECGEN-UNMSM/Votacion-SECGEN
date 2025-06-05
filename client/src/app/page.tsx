"use client"
import SistemaVotacion from "@/components/sistema-votacion";
import { Navbar } from "@/components/navbar"; 
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      redirect("/login");
    }
  }, []);

  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-8 p-8">
      <Toaster></Toaster>
      <Navbar></Navbar>
      <SistemaVotacion />
    </div>
  );
}
