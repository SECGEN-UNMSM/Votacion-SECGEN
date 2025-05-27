// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// DTOs para requests
export interface CreateProcesoRequest {
  titulo: string;
  fechaCierre: string;
}

export interface CreateCandidatoRequest {
  nombre: string;
  categoriaId: string;
  codigoFacultad: string;
}

export interface CreateAsambleistaRequest {
  nombre: string;
}

export interface EmitirVotoRequest {
  asambleistaId: string;
  detalles: {
    categoriaId: string;
    abstencion: boolean;
    candidatosIds: string[];
  }[];
}

// Tipos para respuestas específicas
export interface ResultadoCategoria {
  categoriaId: string;
  categoriaNombre: string;
  candidatos: {
    candidatoId: string;
    candidatoNombre: string;
    codigoFacultad: string;
    votos: number;
  }[];
  abstenciones: number;
}

export interface EstadisticasGenerales {
  totalAsambleistas: number;
  asambleistasQueVotaron: number;
  porcentajeParticipacion: number;
  votosPorCategoria: {
    categoriaId: string;
    categoriaNombre: string;
    totalVotos: number;
    abstenciones: number;
  }[];
}
