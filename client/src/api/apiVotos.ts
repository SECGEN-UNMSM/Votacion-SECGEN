import { baseURL } from "./api";


export const getRankings = async () => {
  const response = await fetch(`${baseURL}/ranking/`)

  if (!response.ok) {
    throw new Error("Error al obtener el ranking")
  }

  return response.json();
}