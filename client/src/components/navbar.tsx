import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full flex justify-between items-center">
      <h4 className="font-bold">Sistema de votación</h4>
      <nav>
        <Link href="/reportes" className="px-3 py-2 text-sm rounded-md cursor-pointer hover:opacity-90 bg-[var(--bg-button-danger)] text-white">Finalizar</Link>
      </nav>
    </header>
  )
}