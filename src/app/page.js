"use client";

import DoctorList from "@/components/DoctorList";
import TurnSelector from "@/components/TurnSelector";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-8">
      <div className="container mx-auto max-w-[1000px]">
        <div className="flex flex-col lg:flex-row justify-between items-center pb-8">
          <h1 className="text-4xl font-bold text-cyan-900">
            Turnos Actuales
          </h1>
          <div className="flex gap-4 mt-8">
          <Link
            href="/doctors/manage"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            Gestionar Doctores
          </Link>
          <Link
            href="/turnos/nuevo"
            className="btn bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
          >
            Dar Turnos
          </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
          <DoctorList />
        </div>

        {/* <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
          <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
            Solicitar Turno
          </h2>
          <TurnSelector />
        </div> */}
      </div>
    </main>
  );
}
