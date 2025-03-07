"use client";

import { useEffect } from "react";
import DoctorList from "@/components/DoctorList";
import { useRouter } from "next/navigation";

const DarTurno = () => {
  const navigate = useRouter();

  useEffect(() => {
    // Optional: Add any client-side initialization logic here
    // For example, checking authentication or localStorage
    const checkAuthentication = () => {
      const dni =
        typeof window !== "undefined" ? localStorage.getItem("dni") : null;
      if (!dni) {
        navigate.push("/");
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleCancel = () => {
    navigate.push("/");
  };

  return (
    //vista usuario
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-8">
      <div className="container mx-auto max-w-[700px]">
        <DoctorList newTurn={true} user={true} />
        <button
          className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium my-4"
          onClick={handleCancel}
        >
          Salir
        </button>
        <button
          className="btn bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium my-4 mx-2"
          onClick={() => navigate.push("/turnos/manage")}
        >
          Mis Turnos
        </button>
      </div>
    </main>
  );
};

export default DarTurno;
