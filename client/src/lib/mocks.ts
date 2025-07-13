import { Candidato, Ranking } from "@/lib/types";

export const mockCandidatos: Ranking[] = [
  {
    idcandidato: 1,
    nombre_candidato: "Ana",
    categoria: "Docentes Principales",
    codigo_facultad: "05",
    total_votos: "4",
  },
  {
    idcandidato: 2,
    nombre_candidato: "Luis",
    categoria: "Docentes Asociados",
    codigo_facultad: "04",
    total_votos: "1",
  },
  {
    idcandidato: 3,
    nombre_candidato: "Sofía",
    categoria: "Docentes Auxiliares",
    codigo_facultad: "10",
    total_votos: "2",
  },
  {
    idcandidato: 4,
    nombre_candidato: "Fernanda",
    categoria: "Estudiantes",
    codigo_facultad: "11",
    total_votos: "0",
  },
];

export const mockCandidatosVotacion: Candidato[] = [
  {
    idcandidato: 11,
    nombre: "Carla",
    categoria: "Docentes Principales",
    codigo_facultad: "18",
  },
  {
    idcandidato: 12,
    nombre: "Javier",
    categoria: "Docentes Asociados",
    codigo_facultad: "17",
  },
  {
    idcandidato: 13,
    nombre: "Leon",
    categoria: "Docentes Auxiliares",
    codigo_facultad: "16",
  },
  {
    idcandidato: 14,
    nombre: "Mariano",
    categoria: "Estudiantes",
    codigo_facultad: "20",
  },
  {
    idcandidato: 15,
    nombre: "Marlo",
    categoria: "Docentes Principales",
    codigo_facultad: "16",
  },
];

export const mockCandidatosPrueba: Candidato[] = [
  {
    idcandidato: 1,
    nombre: "A",
    categoria: "Docentes Principales",
    codigo_facultad: "10",
  },
  {
    idcandidato: 2,
    nombre: "B",
    categoria: "Docentes Asociados",
    codigo_facultad: "6",
  },
  {
    idcandidato: 3,
    nombre: "C",
    categoria: "Estudiantes",
    codigo_facultad: "2",
  },
  {
    idcandidato: 4,
    nombre: "D",
    categoria: "Docentes Auxiliares",
    codigo_facultad: "5",
  },
  {
    idcandidato: 5,
    nombre: "E",
    categoria: "Estudiantes",
    codigo_facultad: "10",
  },
];

export const mockCandidato: Ranking = {
  idcandidato: 4,
  categoria: "Docentes Principales",
  nombre_candidato: "García, Ana María",
  codigo_facultad: "10",
  total_votos: "3",
};

export const mockResultado: Ranking[] = [
  {
    categoria: "Docentes Principales",
    idcandidato: 4,
    nombre_candidato: "Juan Perez",
    codigo_facultad: "20",
    total_votos: "5",
  },
];

export const mockRanking: Ranking[] = [
  {
    categoria: "Docentes Principales",
    idcandidato: 4,
    nombre_candidato: "Juan Perez",
    codigo_facultad: "20",
    total_votos: "5",
  },
  {
    categoria: "Docentes Asociados",
    idcandidato: 2,
    nombre_candidato: "Juan Domingo",
    codigo_facultad: "02",
    total_votos: "5",
  },
  {
    categoria: "Docentes Auxiliares",
    idcandidato: 3,
    nombre_candidato: "Carlos Perez",
    codigo_facultad: "18",
    total_votos: "0",
  },
];

export const mockRankingPrueba: Ranking[] = [
  {
    idcandidato: 1,
    nombre_candidato: "Ascension Morales",
    categoria: "Docentes Principales",
    codigo_facultad: "10",
    total_votos: "4",
  },
];

export const mockAsambleistas = [
  {
    idasambleista: 1,
    nombre: "Juan",
    apellido: "Pérez",
    ha_votado: false,
  },
  {
    idasambleista: 2,
    nombre: "Carlos",
    apellido: "Gonzales",
    ha_votado: true,
  },
];

export const mockCandidatosOrdenados: Ranking[] = [
  {
    idcandidato: 11,
    nombre_candidato: "Juan Carlos",
    categoria: "Docentes Asociados",
    codigo_facultad: "13",
    total_votos: "15",
  },
  {
    idcandidato: 12,
    nombre_candidato: "María Fernanda",
    categoria: "Docentes Principales",
    codigo_facultad: "04",
    total_votos: "13",
  },
  {
    idcandidato: 10,
    nombre_candidato: "Ana López",
    categoria: "Estudiantes",
    codigo_facultad: "01",
    total_votos: "9",
  },
];
