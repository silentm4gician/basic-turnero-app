import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// export async function POST(request, { params }) {
//   try {
//     // Validate Prisma import
//     if (!prisma) {
//       throw new Error('Prisma client is not initialized')
//     }

//     const { id } = params
//     const body = await request.json()
//     const dni = body?.dni

//     // Validate DNI
//     if (!dni || dni.trim() === '') {
//       return NextResponse.json(
//         { error: 'DNI is required' },
//         { status: 400 }
//       )
//     }

//     // Validate doctor ID
//     const doctorId = parseInt(id)
//     if (isNaN(doctorId)) {
//       return NextResponse.json(
//         { error: 'Invalid doctor ID' },
//         { status: 400 }
//       )
//     }

//     const doctor = await prisma.doctor.findUnique({
//       where: { id: doctorId }
//     })

//     if (!doctor) {
//       return NextResponse.json(
//         { error: 'Doctor not found' },
//         { status: 404 }
//       )
//     }

//     // Find or create user based on DNI
//     let user = await prisma.user.findFirst({
//       where: { dni: dni.trim() }
//     })

//     if (!user) {
//       user = await prisma.user.create({
//         data: { dni: dni.trim() }
//       })
//     }

//     // Create turn and update doctor's current turn
//     const updatedDoctor = await prisma.doctor.update({
//       where: { id: doctorId },
//       data: { 
//         currentTurn: doctor.currentTurn + 1,
//         Turn: {
//           create: {
//             patientId: user.id
//           }
//         }
//       },
//       include: {
//         Turn: true
//       }
//     })

//     return NextResponse.json({
//       ...updatedDoctor,
//       currentTurn: updatedDoctor.currentTurn,
//       name: doctor.name
//     })
//   } catch (error) {
//     console.error('Turn creation error:', error)
//     return NextResponse.json(
//       { 
//         error: 'Error updating turn', 
//         details: error.message,
//         stack: error.stack 
//       },
//       { status: 500 }
//     )
//   }
// }

export async function PUT(request, { params }) {
  try {
    const { id } = params
    await prisma.doctor.update({
      where: { id: parseInt(id) },
      data: { currentTurn: 0 }
    })

    return NextResponse.json({ message: 'Turn reset successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error resetting turn', details: error.message },
      { status: 500 }
    )
  }
}


import useTurnStore from '@/store/turnStore'  // Import Zustand store

export async function POST(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const dni = body?.dni

    // Validate DNI
    if (!dni || dni.trim() === '') {
      return NextResponse.json(
        { error: 'DNI is required' },
        { status: 400 }
      )
    }

    // Validate doctor ID
    const doctorId = parseInt(id)
    if (isNaN(doctorId)) {
      return NextResponse.json(
        { error: 'Invalid doctor ID' },
        { status: 400 }
      )
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Find or create user based on DNI
    let user = await prisma.user.findFirst({
      where: { dni: dni.trim() }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { dni: dni.trim() }
      })
    }

    // Create turn and update doctor's current turn
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: { 
        currentTurn: doctor.currentTurn + 1,
        Turn: {
          create: {
            patientId: user.id,
            number: doctor.currentTurn + 1
          }
        }
      },
      include: {
        Turn: true
      }
    })

    // Update the Zustand store with the new currentTurn
    const updateTurnStore = useTurnStore.getState().updateDoctorTurn
    updateTurnStore(doctorId, updatedDoctor.currentTurn)

    return NextResponse.json({
      ...updatedDoctor,
      currentTurn: updatedDoctor.currentTurn,
      name: doctor.name
    })
  } catch (error) {
    console.error('Turn creation error:', error)
    return NextResponse.json(
      { 
        error: 'Error updating turn', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}
