import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const prisma = new PrismaClient();

  try {
    const { dni, isNewUser } = await request.json();

    if (isNewUser) {
      // Check if DNI already exists during registration
      const existingUser = await prisma.user.findFirst({
        where: { dni: dni }
      });

      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: "El DNI ya está registrado. Inicia sesión."
        });
      }

      // Create new user
      await prisma.user.create({
        data: {
          dni: dni
        }
      });

      return NextResponse.json({
        success: true,
        message: "Usuario registrado exitosamente"
      });
    } else {
      // Check if DNI exists during login
      const existingUser = await prisma.user.findFirst({
        where: { dni: dni }
      });

      if (!existingUser) {
        return NextResponse.json({
          success: false,
          message: "DNI no encontrado. Por favor, regístrate primero."
        });
      }

      return NextResponse.json({
        success: true,
        message: "Inicio de sesión exitoso"
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({
      success: false,
      message: "Ocurrió un error. Intenta nuevamente."
    });
  } finally {
    await prisma.$disconnect();
  }
}
