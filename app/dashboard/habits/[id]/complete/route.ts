import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const habit = await prisma.habit.findFirst({
    where: { id: params.id, userId, isActive: true },
  });

  if (!habit) {
    return NextResponse.json({ error: "Hábito no encontrado" }, { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tracking = await prisma.tracking.upsert({
    where: {
      habitId_completedAt: {
        habitId: params.id,
        completedAt: today,
      },
    },
    update: {},
    create: {
      habitId: params.id,
      userId,
      completedAt: today,
    },
  });

  return NextResponse.json({ tracking, completedToday: true });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.tracking.deleteMany({
    where: {
      habitId: params.id,
      userId,
      completedAt: { gte: today },
    },
  });

  return NextResponse.json({ completedToday: false });
}