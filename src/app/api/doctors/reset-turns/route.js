import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    await prisma.doctor.updateMany({
      data: { currentTurn: 0 }
    })

    return NextResponse.json({ message: 'All turns reset successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error resetting all turns' },
      { status: 500 }
    )
  }
}
