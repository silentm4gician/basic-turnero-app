'use client'
import DoctorList from "@/components/DoctorList"
import TurnSelector from "@/components/TurnSelector"
import { RotateCcw } from "lucide-react"
import Link from "next/link"

const DarTurno = () => {

    const handleResetAllTurns = async () => {
        try {
            const response = await fetch('/api/doctors/reset-turns', {
                method: 'POST'
            })

            if (!response.ok) throw new Error('Failed to reset all turns')

            resetAllTurns()
            toast.success('Todos los turnos reiniciados')
        } catch (error) {
            console.error('Error resetting all turns:', error)
            toast.error('No se pudieron reiniciar los turnos')
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-8">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-center mb-3">
                    <h1 className="text-4xl font-bold text-cyan-900">
                        Dar Turnos
                    </h1>
                    <div className="flex items-center space-x-4 mt-8">
                    <Link
                            href="/doctors/manage"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
                        >
                            Gestionar Doctores
                        </Link>
                        <Link
                            href="/"
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                        >
                            Inicio
                        </Link>
                    </div>
        </div>
                <div className="flex flex-col justify-center max-w-[1100px] mx-auto  pt-8">
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
                            {/* <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
                                Solicitar Turno
                            </h2> */}
                            {/* <TurnSelector /> */}
                            <DoctorList newTurn={true} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DarTurno