import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="w-full flex justify-between items-center">
      <h4 className="font-bold">Sistema de votación</h4>
      <nav>
        <Button style={{background: "var(--bg-button-danger)", color: "var(--color-text-white)"}} className="cursor-pointer ">Finalizar</Button>
      </nav>
    </header>
  )
}