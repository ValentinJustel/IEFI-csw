import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id: habitId } = params

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  try {
    await prisma.tracking.create({
      data: {
        habitId,
        userId,
        completedAt: new Date(),
      },
    })
  } catch {
    // Ya existe el tracking de hoy, ignorar
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id: habitId } = params

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  await prisma.tracking.deleteMany({
    where: {
      habitId,
      userId,
      completedAt: { gte: startOfToday },
    },
  })

  return NextResponse.json({ ok: true })
}