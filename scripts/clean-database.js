const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanDatabase() {
  try {
    // Delete all doctors
    const deleteResult = await prisma.doctor.deleteMany()
    console.log(`Deleted ${deleteResult.count} doctors`)
  } catch (error) {
    console.error('Error cleaning database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()
