'use client'

import DoctorForm from '@/components/DoctorForm'
import TurnSelector from '@/components/TurnSelector'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import useTurnStore from '@/store/turnStore'
import { Trash2, Edit2, Trash2Icon, RotateCcw } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function DoctorManagement() {
  const { doctors, setDoctors, resetAllTurns, updateDoctorTurn } = useTurnStore()
  const [editingDoctor, setEditingDoctor] = useState(null)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors')
        if (!response.ok) throw new Error('Failed to fetch doctors')
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
        toast.error('No se pudieron cargar los doctores')
      }
    }
    fetchDoctors()
  }, [setDoctors])

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const response = await fetch(`/api/doctors/delete/${doctorId}`, {
        method: 'DELETE',
      })
      
      const errorBody = await response.json()
      
      if (!response.ok) {
        throw new Error(errorBody.details || 'Failed to delete doctor')
      }
      
      const updatedDoctors = doctors.filter(doctor => doctor.id !== doctorId)
      setDoctors(updatedDoctors)
      toast.success('Doctor eliminado exitosamente')
    } catch (error) {
      console.error('Error deleting doctor:', error)
      
      // Specific error handling based on error type
      if (error.message.includes('Doctor not found')) {
        toast.error('El doctor ya no existe en la base de datos')
      } else {
        toast.error(`No se pudo eliminar el doctor: ${error.message}`)
      }
    }
  }

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor)
  }

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

  const handleResetDoctorTurns = async (doctorId) => {
    try {
      const response = await fetch(`/api/doctors/${doctorId}/reset-turn`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to reset doctor turns')
      
      const doctor = await response.json()
      updateDoctorTurn(doctorId, 0)
      toast.success(`Turnos de ${doctor.name} reiniciados`)
    } catch (error) {
      console.error('Error resetting doctor turns:', error)
      toast.error('No se pudieron reiniciar los turnos del doctor')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-900">
            Gestión de Doctores
          </h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleResetAllTurns}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <RotateCcw size={16} />
              <span>Reiniciar Todos los Turnos</span>
            </button>
            <Link 
              href="/" 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Ver Turnos
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
              <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
                {editingDoctor ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
              </h2>
              <DoctorForm 
                initialData={editingDoctor} 
                onSuccessfulSubmit={() => setEditingDoctor(null)} 
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
              <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
                Solicitar Turno
              </h2>
              <TurnSelector />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
              <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
                Doctores Registrados
              </h2>
              {doctors.length === 0 ? (
                <p className="text-gray-500 text-center">No hay doctores registrados</p>
              ) : (
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div 
                      key={doctor.id} 
                      className="flex justify-between items-center p-4 bg-cyan-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-cyan-900">{doctor.name}</p>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500">Turno actual: {doctor.currentTurn || 0}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleResetDoctorTurns(doctor.id)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Reiniciar turnos del doctor"
                        >
                          <RotateCcw size={20} />
                        </button>
                        <button 
                          onClick={() => handleEditDoctor(doctor)}
                          className="text-cyan-600 hover:text-cyan-800 transition-colors"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2Icon size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
