import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request, { params }) {
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

    const doctor = await prisma.doctor.update({
      where: { id: parsedId },
      data: { currentTurn: 0 }
    })

    return NextResponse.json(doctor)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error resetting doctor turns' },
      { status: 500 }
    )
  }
}
