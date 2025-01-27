import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const { id } = params

          // Convert id to integer
          const parsedId = parseInt(id, 10)

          if (isNaN(parsedId)) {
            return NextResponse.json(
              { error: 'Invalid doctor ID' },
              { status: 400 }
            )
          }

    const data = await request.json()
    const { name, specialty } = data
    
    if (!name || !specialty) {
      return NextResponse.json(
        { error: 'Name and specialty are required' },
        { status: 400 }
      )
    }

    const doctor = await prisma.doctor.update({
      where: { id: parsedId },
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

export async function DELETE(request, { params }) {
  try {
    const { id } = params

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
