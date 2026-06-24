import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const body = await req.json();

  const allowedFields = ["name", "description", "color", "icon", "frequency", "targetDays", "isActive"];
  const data = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  );

  const result = await prisma.habit.updateMany({
    where: { id: params.id, userId },
    data,
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Hábito no encontrado o no tenés permiso para editarlo" },
      { status: 404 }
    );
  }

  const updated = await prisma.habit.findUnique({ where: { id: params.id } });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const result = await prisma.habit.updateMany({
    where: { id: params.id, userId },
    data: { isActive: false },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Hábito no encontrado o no tenés permiso para eliminarlo" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}