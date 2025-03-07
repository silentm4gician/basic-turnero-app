import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// export async function GET() {
//   try {
//     const doctors = await prisma.doctor.findMany({
//       orderBy: { name: 'asc' }
//     })
//     return NextResponse.json(doctors)
//   } catch (error) {
//     return NextResponse.json({ error: 'Error fetching doctors' }, { status: 500 })
//   }
// }

export async function GET() {
  try {
    // Obtener todos los doctores con sus turnos actuales
    const doctores = await prisma.doctor.findMany({
      include: {
        Turn: {
          orderBy: { createdAt: "asc" }, // Ordenar turnos por fecha
          take: 1, // Solo el turno más reciente
          include: { patient: true } // Incluir paciente en el turno actual
        }
      }
    });

    return NextResponse.json(doctores, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo doctores:", error);
    return NextResponse.json({ error: "Error obteniendo doctores" }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const data = await request.json()
    const { name, specialty } = data
    
    if (!name || !specialty) {
      return NextResponse.json(
        { error: 'Name and specialty are required' },
        { status: 400 }
      )
    }

    const doctor = await prisma.doctor.create({
      data: { name, specialty }
    })

    return NextResponse.json(doctor, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating doctor' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const data = await request.json()
    const { id, name, specialty } = data
    
    if (!id || !name || !specialty) {
      return NextResponse.json(
        { error: 'ID, name, and specialty are required' },
        { status: 400 }
      )
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: { name, specialty }
    })

    return NextResponse.json(doctor)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating doctor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json()
    const { id } = data
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await prisma.doctor.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Doctor deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting doctor' },
      { status: 500 }
    )
  }
}
