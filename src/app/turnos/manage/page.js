"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TurnosManage = () => {
  const navigate = useRouter();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnos = async () => {
      console.log('MANAGE')
      // Safely check for localStorage
      const dni = typeof window !== 'undefined' ? localStorage.getItem("dni") : null;
      
      if (!dni) {
        navigate.push("/");
        return;
      }

      try {
        const res = await fetch(`/api/turnos?dni=${dni}`);
        if (!res.ok) throw new Error("Error al obtener turnos");

        const data = await res.json();
        setTurnos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-8">
      <div className="container mx-auto max-w-[800px]">
        <h1 className="text-xl font-bold mb-4">Mis Turnos</h1>
        {turnos.length === 0 ? (
          <p>No hay turnos disponibles</p>
        ) : (
          turnos.map((turno) => (
            <div key={turno.id}>
              <p>
                <strong>Doctor:</strong> {turno.doctor.name}
              </p>
              <p>
                <strong>Especialidad:</strong> {turno.doctor.specialty}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(turno.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
        <button
          className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium my-4"
          onClick={() => {
            localStorage.removeItem("dni"); // Limpiar sesión
            navigate.push("/");
          }}
        >
          Salir
        </button>
        <button
          className="btn bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium my-4 mx-2"
          onClick={() => navigate.push("/turnos/nuevo")}
        >
          Solicitar Turno
        </button>
      </div>
    </main>
  );
};

export default TurnosManage;
