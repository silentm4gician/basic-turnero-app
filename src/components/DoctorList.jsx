"use client";
import { useState, useEffect } from "react";
import useTurnStore from "@/store/turnStore";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DoctorList({ newTurn, user }) {
  const [localDoctors, setLocalDoctors] = useState([]);
  const { doctors, setDoctors } = useTurnStore();
  const [message, setMessage] = useState("");
  const [dni, setDni] = useState(() => {
    // Safely get DNI from localStorage only on client-side
    return typeof window !== "undefined"
      ? localStorage.getItem("dni") || ""
      : "";
  });
  const { updateDoctorTurn, broadcastRefresh } = useTurnStore();
  const [search, setSearch] = useState("");
  const navigate = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log("Fetching doctors...");
        const response = await fetch("/api/doctors");
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const data = await response.json();
        console.log("Fetched doctors:", data);
        setDoctors(data);
        setLocalDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    const handleRefresh = () => {
      console.log("Refresh event received");
      fetchDoctors();
    };

    // Only add event listeners on client side
    if (typeof window !== "undefined") {
      console.log("Adding event listeners");

      // Custom event listener
      window.addEventListener("doctors-refresh", handleRefresh);

      // localStorage event listener
      const handleStorageRefresh = (event) => {
        if (event.key === "doctors-refresh") {
          console.log("Refresh triggered by localStorage event");
          fetchDoctors();
        }
      };
      window.addEventListener("storage", handleStorageRefresh);

      // Initial fetch
      fetchDoctors();

      // Cleanup listeners
      return () => {
        console.log("Removing event listeners");
        window.removeEventListener("doctors-refresh", handleRefresh);
        window.removeEventListener("storage", handleStorageRefresh);
      };
    }
  }, [setDoctors]);

  // Sync DNI with localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (dni) {
        localStorage.setItem("dni", dni);
      } else {
        localStorage.removeItem("dni");
      }
    }
  }, [dni]);

  const addTurn = async ({ doctor }) => {
    if (!doctor) return;

    // Validate DNI
    if (!dni || dni.trim() === "") {
      toast.error("Por favor, ingrese un DNI válido");
      return;
    }

    const confirm =
      typeof window !== "undefined"
        ? window.confirm("¿Desea agregar un turno para este doctor?")
        : false;
    if (!confirm) return;

    try {
      const response = await fetch(`/api/doctors/${doctor.id}/turn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni: dni.trim() }),
      });

      if (!response.ok) throw new Error("Failed to get turn");

      const turnData = await response.json();
      updateDoctorTurn(turnData.id, turnData.currentTurn);
      console.log("Broadcasting refresh event");
      broadcastRefresh(); // Broadcast refresh event
      // setDni("");
      navigate.push("/turnos/manage");
      toast.success(
        `Turno N°${turnData.currentTurn} para Dr. ${turnData.name} Agregado Correctamente`
      );
    } catch (error) {
      console.error("Error getting turn:", error);
      setMessage("Error al obtener el turno");
      toast.error("Error al obtener el turno");
    }
  };

  const restTurn = async ({ doctor }) => {
    if (!doctor) return;
    if (doctor.currentTurn === 0) return setMessage("El doctor no tiene turno");

    try {
      const response = await fetch(`/api/doctors/${doctor.id}/cancel-turn`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to get turn");

      const turnData = await response.json();
      updateDoctorTurn(turnData.id, turnData.currentTurn);
      console.log("Broadcasting refresh event");
      broadcastRefresh(); // Broadcast refresh event
      setMessage(`Turno Cancelado Correctamente`);
    } catch (error) {
      console.error("Error getting turn:", error);
      setMessage("Error al cancelar el turno");
    }
  };

  return (
    <div className="space-y-4">
      {newTurn && (
        <div className="mb-4">
          <label
            htmlFor="dni"
            className="block text-sm font-medium text-cyan-800 mb-2"
          >
            DNI
          </label>
          <input
            type="text"
            placeholder={dni !== "" ? "Ingrese su DNI" : dni}
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="w-full border border-cyan-100 rounded-lg p-2 mb-2"
          />
        </div>
      )}
      <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
        {newTurn ? "Lista de Doctores" : "Doctores Disponibles"}
      </h2>
      <label
        htmlFor="search"
        className="block text-sm font-medium text-cyan-800 mb-2"
      >
        Buscar Doctor
      </label>
      <input
        type="search"
        placeholder="Nombre"
        className="border border-cyan-100 rounded-lg p-2 w-full"
      />
      {localDoctors.length === 0 ? (
        <p className="text-gray-500 text-center">No hay doctores registrados</p>
      ) : (
        <div className="space-y-4">
          {localDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex justify-between items-center bg-cyan-50 p-4 rounded-lg border border-cyan-100"
            >
              <div>
                <h3 className="text-lg font-medium text-cyan-900">
                  Dr. {doctor.name}
                </h3>
                <p className="text-sm text-cyan-600">{doctor.specialty}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-cyan-700 mx-3">
                  Turno N°:{" "}
                  <span className="text-green-500">
                    {doctor.currentTurn || 0}
                  </span>
                </span>
                {newTurn && (
                  <>
                    {user ? (
                      ""
                    ) : (
                      <button
                        onClick={() => {
                          restTurn({ doctor });
                        }}
                        className="btn bg-cyan-700 hover:bg-cyan-800 text-red-400 p-1 mx-1 rounded-full"
                      >
                        <MinusCircleIcon />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        addTurn({ doctor });
                      }}
                      className="btn bg-cyan-700 hover:bg-cyan-800 text-green-300 mx-1 p-1 rounded-full"
                    >
                      <PlusCircleIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {message && (
        <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg text-center font-medium animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
}
