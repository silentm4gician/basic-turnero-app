import { useState, useEffect } from 'react'
import useTurnStore from '@/store/turnStore'
import { toast } from 'react-hot-toast'

export default function DoctorForm({ initialData, onSuccessfulSubmit }) {
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const { addDoctor, updateDoctor} = useTurnStore((state) => ({
    addDoctor: state.addDoctor,
    updateDoctor: state.updateDoctor
  }))
  const broadcastRefresh = useTurnStore.getState().broadcastRefresh

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setSpecialty(initialData.specialty)
    } else {
      setName('')
      setSpecialty('')
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = initialData ? `/api/doctors/${initialData.id}` : '/api/doctors'
      const method = initialData ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, specialty })
      })
      
      if (!response.ok) throw new Error(`Failed to ${initialData ? 'update' : 'add'} doctor`)
      
      const doctor = await response.json()
      
      if (initialData) {
        updateDoctor(doctor)
        broadcastRefresh()
        toast.success('Doctor actualizado exitosamente')
      } else {
        addDoctor(doctor)
        broadcastRefresh()
        toast.success('Doctor agregado exitosamente')
      }

      setName('')
      setSpecialty('')
      
      if (onSuccessfulSubmit) {
        onSuccessfulSubmit()
      }
    } catch (error) {
      console.error(`Error ${initialData ? 'updating' : 'adding'} doctor:`, error)
      toast.error(`No se pudo ${initialData ? 'actualizar' : 'agregar'} el doctor`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="input-label">
          Nombre del Doctor
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input rounded-md w-full"
          placeholder="Juan Pérez"
          required
        />
      </div>
      <div>
        <label htmlFor="specialty" className="input-label">
          Especialidad
        </label>
        <input
          type="text"
          id="specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="form-input rounded-md w-full"
          placeholder="Cardiología"
          required
        />
      </div>
      <button 
        type="submit" 
        className="btn w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
      >
        {initialData ? 'Actualizar Doctor' : 'Agregar Doctor'}
      </button>
    </form>
  )
}
