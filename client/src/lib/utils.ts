import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Categoria, RankingBack } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCandidatosPorCategoria(
  rankingVotos: RankingBack[],
  categoria: Categoria
) {
  return rankingVotos.filter((candidato) => candidato.categoria === categoria);
}