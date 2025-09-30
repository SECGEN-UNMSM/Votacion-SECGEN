import { baseURL } from "./api";
import { Votos } from "@/lib/types";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";

export const getRankings = async () => {
  const response = await tauriFetch(`${baseURL}/ranking/`);

  if (!response.ok) {
    throw new Error("Error al obtener el ranking");
  }

  return await response.json();
};

export const registrarVotos = async (data: Votos) => {
  try {
    const response = await tauriFetch(`${baseURL}/registrar-voto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error al registrar voto: ${response.status} - ${errorData}`
      );
    }
  } catch (error) {
    console.error("Error en la petición de registrar votos", error);
  }
};

export const reiniciarVotos = async () => {
  try {
    const response = await tauriFetch(`${baseURL}/reiniciar-voto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error al reiniciar los votos: ${response.status} - ${errorData}`
      );
    }
  } catch (error) {
    console.error("Error al momento de reiniciar el conteo de votos", error);
  }
};
