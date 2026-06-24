// app/api/reminders/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

// 1. GET: Obtener todos los recordatorios
export async function GET(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId },
      include: {
        habit: true
      }
    })
    return NextResponse.json(reminders)
  } catch (err) {
    console.error("Error en GET /api/reminders:", err)
    return NextResponse.json({ error: "Error al cargar recordatorios" }, { status: 500 })
  }
}

// 2. POST: Crear un nuevo recordatorio (Asegúrate de que esté exactamente con 'export async function POST')
export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    const body = await req.json()
    const { habitId, time, days } = body

    if (!habitId || !time) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 })
    }

    const newReminder = await prisma.reminder.create({
      data: {
        userId,
        habitId,
        time,
        days: days || [1, 2, 3, 4, 5],
        isActive: true,
      },
      include: {
        habit: true
      }
    })

    return NextResponse.json(newReminder, { status: 201 })
  } catch (err) {
    console.error("Error en POST /api/reminders:", err)
    return NextResponse.json({ error: "Error al crear recordatorio" }, { status: 500 })
  }
}