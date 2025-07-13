import { baseURL } from "./api";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";

export const getCandidatos = async () => {
  const response = await tauriFetch(`${baseURL}/candidatos/`);

  if (!response.ok) {
    throw new Error("Error al obtener los candidatos")
  }

  return response.json();
}