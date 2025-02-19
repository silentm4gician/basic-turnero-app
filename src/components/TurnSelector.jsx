import { useState, useEffect } from 'react'
import useTurnStore from '@/store/turnStore'

export default function TurnSelector() {
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [message, setMessage] = useState('')
  const { doctors, setDoctors, updateDoctorTurn, broadcastRefresh } = useTurnStore()
  const [localDoctors, setLocalDoctors] = useState([])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors')
        if (!response.ok) throw new Error('Failed to fetch doctors')
        const data = await response.json()
        setDoctors(data)
        setLocalDoctors(data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }
    const handleRefresh = () => {
      console.log('Refresh event received')
      fetchDoctors()
    }

    // Only add event listeners on client side
    if (typeof window !== 'undefined') {
      console.log('Adding event listeners')
      
      // Custom event listener
      window.addEventListener('doctors-refresh', handleRefresh)
      
      // localStorage event listener
      const handleStorageRefresh = (event) => {
        if (event.key === 'doctors-refresh') {
          console.log('Refresh triggered by localStorage event')
          fetchDoctors()
        }
      }
      window.addEventListener('storage', handleStorageRefresh)

      // Initial fetch
      fetchDoctors()

      // Cleanup listeners
      return () => {
        console.log('Removing event listeners')
        window.removeEventListener('doctors-refresh', handleRefresh)
        window.removeEventListener('storage', handleStorageRefresh)
      }
    }
  }, [setDoctors])

  const handleTurnRequest = async () => {
    if (!selectedDoctor) return
    
    try {
      const response = await fetch(`/api/doctors/${selectedDoctor}/turn`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to get turn')
      
      const doctor = await response.json()
      updateDoctorTurn(doctor.id, doctor.currentTurn)
      console.log('Broadcasting refresh event')
      broadcastRefresh() // Broadcast refresh event
      setMessage(`Turno N°${doctor.currentTurn} para Dr. ${doctor.name}`)
    } catch (error) {
      console.error('Error getting turn:', error)
      setMessage('Error al obtener el turno')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="doctor" className="input-label">
          Seleccionar Doctor
        </label>
        <select
          id="doctor"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="form-input rounded-md w-full"
        >
          <option value="">Seleccione un doctor</option>
          {localDoctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              Dr. {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleTurnRequest}
        disabled={!selectedDoctor}
        className="btn w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
      >
        Solicitar Turno
      </button>
      
      {message && (
        <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg text-center font-medium animate-fade-in">
          {message}
        </div>
      )}
    </div>
  )
}
