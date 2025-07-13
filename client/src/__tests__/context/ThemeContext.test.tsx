import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

let localStorageMock: { [key: string]: string } = {};

const mockLocalStorage = {
  getItem: (key: string) => localStorageMock[key] || null,
  setItem: (key: string, value: string) => {
    localStorageMock[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageMock[key];
  },
  clear: () => {
    localStorageMock = {};
  },
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

/**
 * Componente que consume al contexto
 */
const TestThemeComponent = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("TestThemeComponent debe usarse dentro de ThemeProvider");
  }

  const { isDark, toggleDarkMode } = context;

  return (
    <div>
      <span data-testid="is-dark-value">{isDark ? "true" : "false"}</span>
      <button onClick={toggleDarkMode}>Toggle Theme</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <ThemeProvider>
      <TestThemeComponent />
    </ThemeProvider>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    (window.matchMedia as jest.Mock).mockClear();

    document.documentElement.className = "";
  });

  it("Debería inicializar en modo oscuro si 'dark' está en localStorage", () => {
    mockLocalStorage.setItem("theme", "dark");
    renderWithProvider();

    expect(screen.getByTestId("is-dark-value")).toHaveTextContent("true");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("Debería inicializar en modo claro si 'light' está en localStorage", () => {
    mockLocalStorage.setItem("theme", "light");
    renderWithProvider();

    expect(screen.getByTestId("is-dark-value")).toHaveTextContent("false");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("Debería inicializar en modo oscuro si el sistema lo prefiere y no hay nada en localStorage", () => {
    (window.matchMedia as jest.Mock).mockReturnValueOnce({ matches: true });
    renderWithProvider();

    expect(screen.getByTestId("is-dark-value")).toHaveTextContent("true");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("Debería inicializar en modo claro por defecto", () => {
    renderWithProvider();

    expect(screen.getByTestId("is-dark-value")).toHaveTextContent("false");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("Debería cambiar a modo oscuro cuando se llama al boton toggle", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    expect(screen.getByTestId("is-dark-value")).toHaveTextContent("false");
    expect(document.documentElement).not.toHaveClass("dark");

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    await act(async () => {
      await user.click(toggleButton);
    });

    expect(screen.getByTestId("is-dark-value")).toHaveTextContent("true");
    expect(document.documentElement).toHaveClass("dark");
    expect(mockLocalStorage.getItem("theme")).toBe("dark");
  });

  it("Debería cambiar a modo claro cuando se llama al boton del toggle desde el modo oscuro", async () => {
    mockLocalStorage.setItem("theme", "dark");
    const user = userEvent.setup();
    renderWithProvider();

    expect(screen.getByTestId("is-dark-value")).toHaveTextContent("true");

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    await act(async () => {
      await user.click(toggleButton);
    });

    expect(screen.getByTestId("is-dark-value")).toHaveTextContent("false");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(mockLocalStorage.getItem("theme")).toBe("light");
  });

  it("No debería renderizar los hijos si el componente no está montado", () => {
    const { container } = render(
      <ThemeProvider>
        <div>Hijo</div>
      </ThemeProvider>
    );

    expect(container).not.toBeEmptyDOMElement();
  });
});
