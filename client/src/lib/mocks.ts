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

/*

      //console.log(data);
      
      toast.promise(agregarVoto(data), {
        loading: "Guardando voto...",
        success: <b>Voto guardado!</b>,
        error: <b>No se puedo guardar el voto.</b>,
      });

      agregarVoto(data)
        .then(() => {
          Swal.hideLoading();
          Swal.update({
            icon: "success",
            title: "¡Voto procesado!",
            text: `El voto ha sido procesado exitosamente.`,
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#28A745",
          });
        })
        .catch(() => {
          Swal.hideLoading();
          Swal.update({
            icon: "error",
            title: "Error",
            text: "Algo salió mal",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            confirmButtonColor: "#dc3545",
          });
        });
      */

{
  /* Modal de Confirmación */
}
{
  /*
        
        <Dialog open={modalConfirmacion} onOpenChange={setModalConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Confirmar Votación</DialogTitle>
            <DialogDescription className="text-[16px]">
              Por favor confirme su selección de candidatos:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {listaCategorias.map((categoria) => {
              const candidatosSeleccionados = selecciones[categoria]
                .map((idcandidato) =>
                  candidatos.find(
                    (c) => c.idcandidato.toString() === idcandidato
                  )
                )
                .filter(Boolean) as Candidato[];

              return (
                <div key={categoria} className="mb-4">
                  <h4 className="font-medium text-lg">{categoria}:</h4>
                  {abstenciones[categoria] ? (
                    <p className="pl-5 mt-1 italic text-gray-500 text-lg">
                      Abstención
                    </p>
                  ) : (
                    <ul className="list-none pl-5 mt-1">
                      {candidatosSeleccionados.map((candidato) => (
                        <li
                          key={candidato.idcandidato}
                          className="flex items-center gap-2 text-lg pb-2"
                        >
                          <span className="font-medium w-8">
                            {candidato.codigo_facultad}.
                          </span>
                          <span>{candidato.nombre}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="text-[16px] px-4 cursor-pointer"
              onClick={() => setModalConfirmacion(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={emitirVoto}
              className="bg-green-600 hover:bg-green-700 text-[16px] px-4 cursor-pointer"
            >
              Confirmar Voto
            </Button>
            </DialogFooter>
            </DialogContent>
          </Dialog>

        */
}
