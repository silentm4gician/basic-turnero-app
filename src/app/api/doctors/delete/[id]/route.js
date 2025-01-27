import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(request, { params }) {
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

    // Check if doctor exists before deleting
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: parsedId }
    })

    if (!existingDoctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Perform deletion
    const deletedDoctor = await prisma.doctor.delete({
      where: { id: parsedId }
    })

    return NextResponse.json({ 
      message: 'Doctor deleted successfully', 
      deletedDoctor 
    })
  } catch (error) {
    console.error('Full delete error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    return NextResponse.json(
      { 
        error: 'Error deleting doctor', 
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
