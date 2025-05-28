"use client"

import { createContext, useEffect, useState } from "react";
import { getCandidatos } from "@/api/apiCandidato";
import { CandidatoBack } from "@/lib/types"

interface CandidatoContextType {
  candidatos: CandidatoBack[];
  fetchCandidatos: () => Promise<void>;
  loading: boolean,
}

export const CandidatoContext = createContext<CandidatoContextType | undefined>(
  undefined
)

export const CandidatoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidatos, setCandidatos] = useState<CandidatoBack[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  
  const fetchCandidatos = async () => {
    setLoading(true)
    try {
      const response = await getCandidatos();
      setCandidatos(response);
    } catch (error) {
      console.error("Error al obtener los candidatos")
    } finally {
      setLoading(false);
    }
  } 

  useEffect(() => {
    fetchCandidatos();
  }, [])
  
  
  return (
    <CandidatoContext.Provider value={{
      candidatos,
      fetchCandidatos,
      loading,
    }}>
      {children}
    </CandidatoContext.Provider>
  )
}