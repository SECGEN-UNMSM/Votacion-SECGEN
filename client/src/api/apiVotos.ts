import { baseURL } from "./api";
import { VotosBack } from "@/lib/types";


export const getRankings = async () => {
  const response = await fetch(`${baseURL}/ranking/`)

  if (!response.ok) {
    throw new Error("Error al obtener el ranking")
  }

  return response.json();
}

export const registrarVotos = async (data: VotosBack) => {
  try {
    const response = await fetch(`${baseURL}/registrar-voto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error al registrar voto: ${response.status} - ${errorData}`)
    }
  } catch (error) {
    console.error("Error en la petición de registrar votos")
  }
}