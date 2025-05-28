"use client"

import { createContext, useEffect, useState } from "react";
import { getAsambleistas } from "@/api/apiAsambleista";
import { AsambleistaBack } from "@/lib/types";

export interface AsambleistaContextType {
  asambleistas: AsambleistaBack[];
  loading: boolean;
  fetchAsambleistas: () => Promise<void>;
}

export const AsambleistaContext = createContext<AsambleistaContextType | undefined>(
  undefined
);

export const AsambleistaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [asambleistas, setAsambleistas] = useState<AsambleistaBack[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAsambleistas = async () => {
    setLoading(true);
    try {
      const response = await getAsambleistas();
      setAsambleistas(response);
    } catch (error) {
      console.log("Error al obtener los asambleistas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAsambleistas();
  }, [])
  

  return (
    <AsambleistaContext.Provider
      value={{
        asambleistas,
        fetchAsambleistas,
        loading,
      }}
    >
      { children }
    </AsambleistaContext.Provider>
  );
}
