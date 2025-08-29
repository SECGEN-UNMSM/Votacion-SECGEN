import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Categoria, Ranking } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCandidatosPorCategoria(
  rankingVotos: Ranking[],
  categoria: Categoria
) {
  return rankingVotos.filter((candidato) => candidato.categoria === categoria);
}

export const getColorCategoria = (categoria: Categoria) => {
  switch (categoria) {
    case "Docentes Principales":
      return "bg-[var(--bg-doc-principales)]";
    case "Docentes Asociados":
      return "bg-[var(--bg-doc-asociados)]";
    case "Docentes Auxiliares":
      return "bg-[var(--bg-doc-auxiliares)]";
    case "Estudiantes":
      return "bg-[var(--bg-estudiantes)]";
    default:
      return "bg-gray-100";
  }
};