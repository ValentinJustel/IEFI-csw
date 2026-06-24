import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export async function GET() {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      timezone: true,
      createdAt: true,
      _count: {
        select: { habits: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const { name, bio, timezone } = await req.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(bio !== undefined && { bio: bio.trim() }),
      ...(timezone !== undefined && { timezone }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      timezone: true,
    },
  });

  return NextResponse.json(user);
}