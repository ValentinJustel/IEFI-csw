// app/api/habits/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId, error } = await requireAuth()
  if (error) return error

  // Desenvolvemos params con await
  const { id } = await params
  const body = await req.json()
  const { name, description, color, icon, frequency } = body

  // Usamos update en vez de updateMany si buscas por un ID único en Mongo
  try {
    const updated = await prisma.habit.update({
      where: { 
        id,
        userId // Garantiza que pertenezca al usuario
      },
      data: {
        name: name?.trim(),
        description: description?.trim() ?? null,
        color,
        icon,
        frequency,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error("Error al actualizar hábito:", err)
    return NextResponse.json({ error: "No encontrado o no autorizado" }, { status: 404 })
  }
}