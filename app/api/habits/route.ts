import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

// 1. MÉTODO POST (Tu código original, está perfecto)
export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    const body = await req.json()
    const { name, description, color, icon, frequency, categoryId } = body

    const newHabit = await prisma.habit.create({
      data: {
        userId,
        name: name?.trim(),
        description: description?.trim() ?? null,
        color,
        icon,
        frequency,
        categoryId, 
      },
    })

    return NextResponse.json(newHabit, { status: 201 })
  } catch (err) {
    console.error("Error en POST /api/habits:", err)
    return NextResponse.json({ error: "Error al crear el hábito" }, { status: 500 })
  }
}

// 2. MÉTODO GET (OBLIGATORIO para que no se borren al dar F5)
export async function GET(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    const habits = await prisma.habit.findMany({
      where: { 
        userId,
        isActive: { not: false }
      },
      include: {
        tracking: true // 💎 SOLUCIÓN: Cambiado de 'trackings' a 'tracking' en singular
      }
    })

    return NextResponse.json(habits)
  } catch (err) {
    console.error("Error en GET /api/habits:", err)
    return NextResponse.json({ error: "Error al obtener hábitos" }, { status: 500 })
  }
}