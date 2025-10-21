export type Categoria = "Docentes Principales" | "Docentes Asociados" | "Docentes Auxiliares" | "Estudiantes"

export const listaCategorias: Categoria[] = [
  "Docentes Principales",
  "Docentes Asociados",
  "Docentes Auxiliares",
  "Estudiantes",
];

export const limitesPorCategoria: Record<
  Categoria,
  { minimo: number; maximo: number }
> = {
  "Docentes Principales": {minimo: 1, maximo:3},
  "Docentes Asociados": {minimo: 1, maximo:2},
  "Docentes Auxiliares": {minimo: 1, maximo: 1},
  Estudiantes: {minimo: 1, maximo: 3},
};


export interface LoginFields {
  username: string;
  password: string;
}

/* TIPADO */
export interface Asambleista {
  idasambleista: number,
  nombre: string,
  apellido: string,
  ha_votado: boolean,
}

export interface Candidato {
  idcandidato: number,
  nombre: string,
  categoria: string, // Choices
  codigo_facultad: string,
}

export interface Ranking {
  categoria: string,
  idcandidato: number,
  nombre_candidato: string,
  codigo_facultad: string,
  total_votos: string
}


export interface VotoCategoria {
  categoria: string,
  idcandidatos?: number[],
  abstencion?: boolean,
}

export interface Votos {
  idasambleista: number,
  votos: VotoCategoria[],
}

export type CandidatoItemType = {
  candidato: Ranking;
  isChecked: boolean;
  isDisabled: boolean;
  onSelectionChange: (idCandidato: string, isChecked: boolean) => void;
};

export type CandidatoColumnType = {
  candidatos: Ranking[];
  seleccionesCategoria: string[];
  limiteMaximo: number;
  isDisabled: boolean;
  onSelectionChange: (idCandidato: string, isChecked: boolean) => void;
};

export type ListaCandidatosType = {
  categoria: Categoria;
  loadingCandidato: boolean;
  candidatos: Candidato[];
  rankingVotos: Ranking[];
  abstenciones: Record<Categoria, boolean>;
  selecciones: Record<Categoria, string[]>;
  limitesPorCategoria: Record<Categoria, { minimo: number; maximo: number }>;
  handleSeleccionCandidato: (
    categoria: Categoria,
    candidatoId: string,
    checked: boolean
  ) => void;
};

export type RankingVotosCandidatoType = {
  loadingRanking: boolean;
  rankingVotos: Ranking[];
  candidatosOrdenados: Ranking[];
  state: boolean;
};