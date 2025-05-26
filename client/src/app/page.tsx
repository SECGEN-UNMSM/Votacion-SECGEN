import SistemaVotacion from "@/components/sistema-votacion";
import { Navbar } from "@/components/navbar"; 

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-8 p-8">
      <Navbar></Navbar>
      <SistemaVotacion />
    </div>
  );
}
