import { baseURL } from "./api";


export const getCandidatos = async () => {
  const response = await fetch(`${baseURL}/candidatos/`)

  if (!response.ok) {
    throw new Error("Error al obtener los candidatos")
  }

  return response.json();
}