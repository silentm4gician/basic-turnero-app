import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTurnStore = create(persist((set, get) => ({
  doctors: [],
  setDoctors: (doctors) => set({ doctors }),
  addDoctor: (doctor) => set((state) => ({ 
    doctors: [...state.doctors, doctor] 
  })),
  updateDoctor: (updatedDoctor) => set((state) => ({
    doctors: state.doctors.map(doctor =>
      doctor.id === updatedDoctor.id ? updatedDoctor : doctor
    )
  })),
  updateDoctorTurn: (doctorId, newTurn) => set((state) => ({
    doctors: state.doctors.map(doctor =>
      doctor.id === doctorId ? { ...doctor, currentTurn: newTurn } : doctor,
    )
  })),
  resetAllTurns: () => set((state) => ({
    doctors: state.doctors.map(doctor => ({ ...doctor, currentTurn: 0 }))
  })),
  // Safe broadcast method that checks for window
  broadcastRefresh: () => {
    console.log('Attempting to broadcast refresh')
    if (typeof window !== 'undefined') {
      console.log('Window is defined, creating and dispatching event')
      
      // Dispatch custom event in current window
      const event = new CustomEvent('doctors-refresh')
      window.dispatchEvent(event)
      
      // Use localStorage to signal other windows
      localStorage.setItem('doctors-refresh', Date.now().toString())
      
      console.log('Refresh event dispatched')
    } else {
      console.log('Window is undefined, cannot dispatch event')
    }
  }
}), {
  name: 'turn-store',
  // Ensure store works on both client and server
  getStorage: () => (typeof window !== 'undefined' ? localStorage : null),
}))

export default useTurnStore
