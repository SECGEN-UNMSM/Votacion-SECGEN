
import { baseURL } from "./api";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";


export const getAsambleistas = async () => {
  const response = await tauriFetch(`${baseURL}/asambleistas/`);
  
  if (!response.ok) {
    throw new Error("Error al obtener los asambleistas")
  }

  return response.json();
}