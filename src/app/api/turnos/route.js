import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dni = searchParams.get("dni");

  if (!dni) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    // Buscar usuario por DNI
    const user = await prisma.user.findFirst({ where: { dni } });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener turnos del usuario
    const turnos = await prisma.turn.findMany({
      where: { patientId: user.id }, // Filtra por el usuario autenticado
      include: { doctor: true }, // Incluye los datos del doctor
    });

    return NextResponse.json(turnos, { status: 200 });
  } catch (error) {
    console.error("Error obteniendo turnos:", error);
    return NextResponse.json(
      { error: "Error obteniendo turnos" },
      { status: 500 }
    );
  }
}
