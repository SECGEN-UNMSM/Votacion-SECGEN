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