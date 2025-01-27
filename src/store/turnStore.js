import { create } from 'zustand'

const useTurnStore = create((set) => ({
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
      doctor.id === doctorId ? { ...doctor, currentTurn: newTurn } : doctor
    )
  })),
  resetAllTurns: () => set((state) => ({
    doctors: state.doctors.map(doctor => ({ ...doctor, currentTurn: 0 }))
  })),
}))

export default useTurnStore
