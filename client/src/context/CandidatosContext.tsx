"use client"

import { createContext, useEffect, useState } from "react";
import { getCandidatos } from "@/api/apiCandidato";
import { CandidatoBack } from "@/lib/types"

interface CandidatoContextType {
  candidatos: CandidatoBack[];
  fetchCandidatos: () => Promise<void>;
}

export const CandidatoContext = createContext<CandidatoContextType | undefined>(
  undefined
)

export const CandidatoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidatos, setCandidatos] = useState<CandidatoBack[]>([]);
  
  const fetchCandidatos = async () => {
    try {
      const response = await getCandidatos();
      setCandidatos(response);
    } catch (error) {
      console.error("Error al obtener los candidatos")
    }
  } 

  useEffect(() => {
    fetchCandidatos();
  }, [])
  
  
  return (
    <CandidatoContext.Provider value={{
      candidatos,
      fetchCandidatos,
    }}>
      {children}
    </CandidatoContext.Provider>
  )
}