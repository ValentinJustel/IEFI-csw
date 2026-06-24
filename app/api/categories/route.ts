import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

export async function GET(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    const categories = await prisma.category.findMany({
      where: { userId }
    })
    return NextResponse.json(categories)
  } catch (err) {
    console.error("Error en GET /api/categories:", err)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    const body = await req.json()
    const { name, color, icon } = body

    const newCategory = await prisma.category.create({
      data: {
        userId,
        name: name.trim(),
        color,
        icon,
      },
    })
    return NextResponse.json(newCategory, { status: 201 })
  } catch (err) {
    console.error("Error en POST /api/categories:", err)
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 })
  }
}