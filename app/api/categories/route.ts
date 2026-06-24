import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

export async function GET() {
  const { userId, error } = await requireAuth()
  if (error) return error

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { name, color, icon } = await req.json()

  if (!name?.trim()) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
  }

  const category = await prisma.category.create({
    data: {
      userId,
      name: name.trim(),
      color: color ?? "#3b82f6",
      icon: icon ?? "📁",
    },
  })

  return NextResponse.json(category, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { userId, error } = await requireAuth()
  if (error) return error

  const { id } = await req.json()

  await prisma.category.deleteMany({
    where: { id, userId },
  })

  return NextResponse.json({ ok: true })
}