import { useState, useEffect } from 'react'
import useTurnStore from '@/store/turnStore'

export default function DoctorList() {
  const { doctors, setDoctors } = useTurnStore()

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors')
        if (!response.ok) throw new Error('Failed to fetch doctors')
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }
    fetchDoctors()
  }, [setDoctors])

  return (
    <div>
      <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
        Doctores Disponibles
      </h2>
      {doctors.length === 0 ? (
        <p className="text-gray-500 text-center">No hay doctores registrados</p>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="flex justify-between items-center bg-cyan-50 p-4 rounded-lg border border-cyan-100"
            >
              <div>
                <h3 className="text-lg font-medium text-cyan-900">
                  Dr. {doctor.name}
                </h3>
                <p className="text-sm text-cyan-600">
                  {doctor.specialty}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-cyan-700">
                  Turno Actual: {doctor.currentTurn || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
