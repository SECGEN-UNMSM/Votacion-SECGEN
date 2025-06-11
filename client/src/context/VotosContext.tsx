"use client"

import { createContext, useEffect, useState } from "react";
import { getRankings, registrarVotos } from "@/api/apiVotos";
import { RankingBack, VotosBack } from "@/lib/types"
import { useAsambleistas } from "@/hooks/useAsambleistas";
import toast from "react-hot-toast";

export interface VotosContextType {
  rankingVotos: RankingBack[];
  loading: boolean,
  agregarVoto: (data: VotosBack) => Promise<void>
}

export const VotosContext = createContext<VotosContextType | undefined>(
  undefined
)

export const VotosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rankingVotos, setRankingVotos] = useState<RankingBack[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const { fetchAsambleistas } = useAsambleistas();
  
  const fetchRankingVotos = async () => {
    setLoading(true)
    try {
      const response = await getRankings();
      setRankingVotos(response);
    } catch (error) {
      console.error("Error al obtener el ranking de votos", error)
    } finally {
      setLoading(false);
    }
  }

  const agregarVoto = async (data: VotosBack) => {
    try {
      await registrarVotos(data)
      await fetchRankingVotos();
      fetchAsambleistas();
      toast.success("Se registro su voto correctamente.")
    } catch (error) {
      console.log("Error al agregar el voto.", error)
      toast.error("Error al registrar su voto.")
    }
  }

  useEffect(() => {
    fetchRankingVotos();
  }, [])
  
  
  return (
    <VotosContext.Provider value={{
      rankingVotos,
      loading,
      agregarVoto
    }}>
      {children}
    </VotosContext.Provider>
  )
}