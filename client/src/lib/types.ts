export interface Asambleista {
  id: string
  nombre: string
  haVotado: boolean
}

// Modificar la interfaz Candidato para incluir el código de facultad
export interface Candidato {
  id: string
  nombre: string
  categoria: Categoria
  votos: number
  codigoFacultad: string // Código de facultad (01-20)
}

export type Categoria = "Docentes Principales" | "Docentes Asociados" | "Docentes Auxiliares" | "Estudiantes"

export interface Voto {
  asambleistaId: string
  candidatosIds: string[] // Ahora es un array de IDs
  categoria: Categoria
}

export const limitesPorCategoria: Record<Categoria, number> = {
  "Docentes Principales": 3,
  "Docentes Asociados": 2,
  "Docentes Auxiliares": 1,
  Estudiantes: 3,
}
