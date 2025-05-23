import type { Asambleista, Candidato, Categoria } from "./types"

export const categorias: Categoria[] = [
  "Docentes Principales",
  "Docentes Asociados",
  "Docentes Auxiliares",
  "Estudiantes",
]

export const asambleistasIniciales: Asambleista[] = [
  { id: "1", nombre: "Juan Pérez", haVotado: false },
  { id: "2", nombre: "María López", haVotado: false },
  { id: "3", nombre: "Carlos Rodríguez", haVotado: false },
  { id: "4", nombre: "Ana Martínez", haVotado: false },
  { id: "5", nombre: "Pedro Sánchez", haVotado: false },
  { id: "6", nombre: "Laura García", haVotado: false },
  { id: "7", nombre: "Miguel Fernández", haVotado: false },
  { id: "8", nombre: "Sofía Torres", haVotado: false },
]

export const candidatosIniciales: Candidato[] = [
  // Docentes Principales
  { id: "dp1", nombre: "Roberto Gómez", categoria: "Docentes Principales", votos: 0, codigoFacultad: "05" },
  { id: "dp2", nombre: "Carmen Jiménez", categoria: "Docentes Principales", votos: 0, codigoFacultad: "12" },
  { id: "dp3", nombre: "Francisco Ruiz", categoria: "Docentes Principales", votos: 0, codigoFacultad: "08" },
  { id: "dp4", nombre: "Luisa Morales", categoria: "Docentes Principales", votos: 0, codigoFacultad: "03" },
  { id: "dp5", nombre: "Antonio Vega", categoria: "Docentes Principales", votos: 0, codigoFacultad: "15" },

  // Docentes Asociados
  { id: "da1", nombre: "Elena Morales", categoria: "Docentes Asociados", votos: 0, codigoFacultad: "07" },
  { id: "da2", nombre: "Javier Ortega", categoria: "Docentes Asociados", votos: 0, codigoFacultad: "19" },
  { id: "da3", nombre: "Lucía Navarro", categoria: "Docentes Asociados", votos: 0, codigoFacultad: "01" },
  { id: "da4", nombre: "Martín Soto", categoria: "Docentes Asociados", votos: 0, codigoFacultad: "10" },

  // Docentes Auxiliares
  { id: "dau1", nombre: "Raúl Molina", categoria: "Docentes Auxiliares", votos: 0, codigoFacultad: "14" },
  { id: "dau2", nombre: "Beatriz Castro", categoria: "Docentes Auxiliares", votos: 0, codigoFacultad: "06" },
  { id: "dau3", nombre: "Daniel Herrera", categoria: "Docentes Auxiliares", votos: 0, codigoFacultad: "11" },

  // Estudiantes
  { id: "e1", nombre: "Alejandro Vargas", categoria: "Estudiantes", votos: 0, codigoFacultad: "02" },
  { id: "e2", nombre: "Natalia Reyes", categoria: "Estudiantes", votos: 0, codigoFacultad: "09" },
  { id: "e3", nombre: "Pablo Mendoza", categoria: "Estudiantes", votos: 0, codigoFacultad: "16" },
  { id: "e4", nombre: "Valeria Campos", categoria: "Estudiantes", votos: 0, codigoFacultad: "04" },
  { id: "e5", nombre: "Gabriel Torres", categoria: "Estudiantes", votos: 0, codigoFacultad: "18" },
]
