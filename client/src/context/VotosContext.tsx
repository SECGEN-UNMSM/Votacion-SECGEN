"use client"

import { createContext, useEffect, useState } from "react";
import { getRankings } from "@/api/apiVotos";
import { RankingBack } from "@/lib/types"

export interface VotosContextType {
  rankingVotos: RankingBack[];
  loading: boolean,
}

export const VotosContext = createContext<VotosContextType | undefined>(
  undefined
)

export const VotosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rankingVotos, setRankingVotos] = useState<RankingBack[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  
  const fetchRankingVotos = async () => {
    setLoading(true)
    try {
      const response = await getRankings();
      setRankingVotos(response);
    } catch (error) {
      console.error("Error al obtener el ranking de votos")
    } finally {
      setLoading(false);
    }
  } 

  useEffect(() => {
    fetchRankingVotos();
  }, [])
  
  
  return (
    <VotosContext.Provider value={{
      rankingVotos,
      loading,
    }}>
      {children}
    </VotosContext.Provider>
  )
}