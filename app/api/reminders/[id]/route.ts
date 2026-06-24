// app/api/reminders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

// DELETE: Eliminar físicamente de MongoDB usando el ID de la URL
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    // Forzamos la resolución de params por compatibilidad con Next.js moderno
    const { id } = await params;

    console.log(`[BACKEND] Intentando eliminar recordatorio con ID: ${id} para el usuario: ${userId}`);

    // Eliminamos asegurando que pertenezca al usuario autenticado
    const deleted = await prisma.reminder.deleteMany({
      where: { 
        id: id,
        userId: userId
      },
    })

    console.log(`[BACKEND] Resultado del borrado:`, deleted);

    return NextResponse.json({ success: true, deletedCount: deleted.count })
  } catch (err) {
    console.error("Error crítico en DELETE /api/reminders/[id]:", err)
    return NextResponse.json({ error: "No se pudo eliminar el recordatorio de la DB" }, { status: 500 })
  }
}

// PATCH: Cambiar el estado del Switch (Activo/Inactivo)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    const { id } = await params;
    const body = await req.json()
    const { isActive } = body

    const updatedReminder = await prisma.reminder.update({
      where: { 
        id: id, 
        userId: userId 
      },
      data: { isActive },
    })

    return NextResponse.json(updatedReminder)
  } catch (err) {
    console.error("Error en PATCH /api/reminders/[id]:", err)
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}