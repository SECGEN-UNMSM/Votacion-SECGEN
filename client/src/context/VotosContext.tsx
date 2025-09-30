"use client";

import { createContext, useEffect, useState } from "react";
import { getRankings, registrarVotos, reiniciarVotos } from "@/api/apiVotos";
import { Ranking, Votos } from "@/lib/types";
import { useAsambleistas } from "@/hooks/useAsambleistas";

export interface VotosContextType {
  rankingVotos: Ranking[];
  loading: boolean;
  agregarVoto: (data: Votos) => Promise<void>;
  reiniciarTodo: () => Promise<void>;
}

export const VotosContext = createContext<VotosContextType | undefined>(
  undefined
);

export const VotosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rankingVotos, setRankingVotos] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { fetchAsambleistas } = useAsambleistas();

  const fetchRankingVotos = async () => {
    setLoading(true);
    try {
      const response = await getRankings();
      setRankingVotos(response);
    } catch (error) {
      console.error("Error al obtener el ranking de votos", error);
    } finally {
      setLoading(false);
    }
  };

  const agregarVoto = async (data: Votos) => {
    try {
      await registrarVotos(data);
      await fetchRankingVotos();
      fetchAsambleistas();
      //toast.promise("Se registro su voto correctamente.")
      console.log("Datos enviados correctamente.");
    } catch (error) {
      console.log("Error al agregar el voto.", error);
    }
  };

  const reiniciarTodo = async () => {
    try {
      await reiniciarVotos();
      await fetchRankingVotos();
      fetchAsambleistas();
    } catch (error) {
      console.log("Error al reiniciar votos", error);
    }
  };

  useEffect(() => {
    fetchRankingVotos();
  }, []);

  return (
    <VotosContext.Provider
      value={{
        rankingVotos,
        loading,
        agregarVoto,
        reiniciarTodo,
      }}
    >
      {children}
    </VotosContext.Provider>
  );
};
