import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request, { params }) {
    try {
        const { id } = params
        const doctor = await prisma.doctor.findUnique({
            where: { id: parseInt(id) }
        })

        if (!doctor) {
            return NextResponse.json(
                { error: 'Doctor not found' },
                { status: 404 }
            )
        }

        const updatedDoctor = await prisma.doctor.update({
            where: { id: parseInt(id) },
            data: { currentTurn: doctor.currentTurn - 1 }
        })

        return NextResponse.json(updatedDoctor)
    } catch (error) {
        return NextResponse.json(
            { error: 'Error updating turn' },
            { status: 500 }
        )
    }
}