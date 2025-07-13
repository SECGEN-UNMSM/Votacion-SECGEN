import { getAsambleistas } from "@/api/apiAsambleista";
import { getCandidatos } from "@/api/apiCandidato";
import { getRankings, registrarVotos } from "@/api/apiVotos";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import "@testing-library/jest-dom";

jest.mock("@tauri-apps/plugin-http", () => ({
  // Y que devuelva un objeto con una función 'fetch' falsa que podemos controlar.
  fetch: jest.fn(),
}));

/**
 * Prueba de apiVotos
 */
describe("getRankings", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debería de retornar los datos si la respuesta es exitosa", async () => {
    const mockData = [
      {
        categoria: "Docentes Principales",
        idcandidato: 4,
        nombre_candidato: "Juan Perez",
        codigo_facultad: "20",
        total_votos: "5",
      },
    ];

    (tauriFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await getRankings();
    expect(data).toEqual(mockData);
    expect(tauriFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/ranking\//)
    );
  });

  it("Debería de mostrar error si la respuesta no es exitosa", async () => {
    (tauriFetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => {},
    });

    await expect(getRankings()).rejects.toThrow("Error al obtener el ranking");
  });
});

describe("registrarVoto", () => {
  let consoleErrorSpy: jest.SpyInstance;

  // Antes de cada prueba en este 'describe'
  beforeEach(() => {
    // 1. Creamos el espía en console.error
    consoleErrorSpy = jest.spyOn(console, "error");
    // 2. (Opcional pero recomendado) Mockeamos su implementación para que no imprima nada
    //    en la terminal durante la ejecución de los tests.
    consoleErrorSpy.mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it("Debería de registrar los votos si los datos son correctos", async () => {
    const mockData = {
      idasambleista: 4,
      votos: [
        {
          categoria: "Docentes Principales",
          idcandidatos: [4, 2],
          abstencion: false,
        },
      ],
    };

    (tauriFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    });

    await registrarVotos(mockData);

    expect(tauriFetch).toHaveBeenCalledWith(
      expect.stringContaining("/registrar-voto"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockData),
      }
    );
  });

  it("Debería de mostrarse un mensaje de error si los datos son incorrectos", async () => {
    const mockData = {
      idasambleista: 4,
      votos: [
        {
          categoria: "Docentes Principales",
          idcandidatos: [4, 2],
          abstencion: false,
        },
      ],
    };

    (tauriFetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => "Error del servidor",
      status: 400,
    });

    await registrarVotos(mockData);

    expect(console.error).toHaveBeenCalledWith(
      "Error en la petición de registrar votos",
      expect.any(Error)
    );
  });
});

/**
 * Pruebas de apiAsambleista
 */
describe("getAsambleista", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debería de retornar los datos si la respuesta es exitosa", async () => {
    const mockData = [
      {
        idasambleista: 4,
        nombre: "Carlos Alberto",
        apellido: "Moreno Morales",
        ha_votado: false,
      },
    ];

    (tauriFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await getAsambleistas();
    expect(data).toEqual(mockData);
    expect(tauriFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/asambleistas\//)
    );
  });

  it("Debería de mostrar error si la respuesta no es exitosa", async () => {
    (tauriFetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => {},
    });

    await expect(getAsambleistas()).rejects.toThrow(
      "Error al obtener los asambleistas"
    );
  });
});

/**
 * Pruebas de apiCandidato
 */
describe("getCandidato", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debería de retornar los datos si la respuesta es exitosa", async () => {
    const mockData = [
      {
        idcandidato: 4,
        nombre: "Carlos Moreno Morales",
        categoria: "Docentes Principales",
        codigo_facultad: "20",
      },
    ];

    (tauriFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await getCandidatos();
    expect(data).toEqual(mockData);
    expect(tauriFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/candidatos\//)
    );
  });

  it("Debería de mostrar error si la respuesta no es exitosa", async () => {
    (tauriFetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => {},
    });

    await expect(getCandidatos()).rejects.toThrow(
      "Error al obtener los candidatos"
    );
  });
});
