import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id } = params
  const body = await req.json()
  const { name, description, color, icon, frequency } = body

  const habit = await prisma.habit.updateMany({
    where: { id, userId },
    data: {
      name: name?.trim(),
      description: description?.trim() ?? null,
      color,
      icon,
      frequency,
    },
  })

  if (habit.count === 0) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  }

  const updated = await prisma.habit.findUnique({ where: { id } })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id } = params

  await prisma.habit.updateMany({
    where: { id, userId },
    data: { isActive: false },
  })

  return NextResponse.json({ ok: true })
}