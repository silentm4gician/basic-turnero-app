"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const [newUser, setNewUser] = useState(true);
  const [document, setDocument] = useState(true);
  const [dni, setDni] = useState("");
  const navigation = useRouter();

  const reset = () => {
    setDocument(true);
    setNewUser(true);
  };

  const newUserHandler = () => {
    setNewUser(true);
    setDocument(false);
  };

  const oldUserHandler = () => {
    setNewUser(false);
    setDocument(false);
  };

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!dni) {
      toast.error("Por favor, ingresa un DNI");
      return;
    }

    try {
      // Server action to check DNI and handle authentication
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          dni, 
          isNewUser: newUser 
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("dni", dni);
        navigation.push("/turnos/nuevo");
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br bg-cyan-900 p-8">
      <div className="container mx-auto w-[400px] h-[200px] text-center border-cyan-100 p-4 rounded bg-cyan-200">
        <h3 className="text-2xl font-bold text-cyan-900 mb-4">
          Solicitar Turno
        </h3>
        {document ? (
          <div className="grid grid-cols-1 gap-2 mx-4">
            <button
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              onClick={oldUserHandler}
            >
              TENGO USUARIO
            </button>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              onClick={newUserHandler}
            >
              NUEVO USUARIO
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="grid grid-cols-1 gap-2 mx-4">
              <input
                type="number"
                placeholder="Documento"
                className="border border-cyan-100 rounded-lg p-2"
                onChange={handleDniChange}
              />
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                type="submit"
              >
                {newUser ? "REGISTRAR" : "INICIAR SESION"}
              </button>
              <button
                onClick={reset}
                className="text-blue-900 hover:text-blue-600 transition-colors duration-200"
              >
                volver
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
