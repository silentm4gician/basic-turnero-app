"use client";

import DoctorList from "@/components/DoctorList";
import TurnSelector from "@/components/TurnSelector";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-8">
      <div className="container mx-auto max-w-[1000px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-900">
            Turnos Disponibles
          </h1>
          <Link
            href="/doctors/manage"
            className="btn bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Gestionar Doctores
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
          <DoctorList />
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
          <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
            Solicitar Turno
          </h2>
          <TurnSelector />
        </div>
      </div>
    </main>
  );
}
