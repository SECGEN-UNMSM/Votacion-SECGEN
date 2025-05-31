import SistemaVotacion from "@/components/sistema-votacion";
import { Navbar } from "@/components/navbar"; 
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden flex flex-col gap-8 p-8">
      <Toaster></Toaster>
      <Navbar></Navbar>
      <SistemaVotacion />
    </div>
  );
}
