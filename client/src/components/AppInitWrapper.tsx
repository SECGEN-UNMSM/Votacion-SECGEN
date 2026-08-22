"use client";

import { useEffect, useState } from "react";
import { useAsambleistasStore } from "@/store/useAsambleistasStore";
import { useCandidatosStore } from "@/store/useCandidatosStore";
import { useVotosStore } from "@/store/useVotosStore";
import { useThemeStore } from "@/store/useThemeStore";

export const AppInitWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const fetchAsambleistas = useAsambleistasStore((state) => state.fetchAsambleistas);
  const fetchCandidatos = useCandidatosStore((state) => state.fetchCandidatos);
  const fetchRankingVotos = useVotosStore((state) => state.fetchRankingVotos);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    setMounted(true);
    fetchAsambleistas();
    fetchCandidatos();
    fetchRankingVotos();
    initTheme();
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
};
