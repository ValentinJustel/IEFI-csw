import { getAuth } from "@/lib/auth"
import { getDb } from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  const auth = await getAuth()
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const db = await getDb()
  const profile = await db.collection("user_profiles").findOne({ userId: session.user.id })

  return NextResponse.json({
    name: session.user.name,
    email: session.user.email,
    timezone: profile?.timezone ?? "america-buenos-aires",
    language: profile?.language ?? "es",
    notifications: profile?.notifications ?? {
      habits: true,
      dailySummary: true,
      achievements: true,
      community: false,
      promotions: false,
    },
    appearance: profile?.appearance ?? {
      darkMode: false,
      weekStart: "monday",
    },
    privacy: profile?.privacy ?? {
      publicProfile: true,
      showInLeaderboards: true,
    },
  })
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuth()
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const db = await getDb()

  await db.collection("user_profiles").updateOne(
    { userId: session.user.id },
    { $set: { ...body, updatedAt: new Date() } },
    { upsert: true }
  )

  if (body.name) {
    await db.collection("user").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { name: body.name, updatedAt: new Date() } }
    )
  }

  return NextResponse.json({ ok: true })
}
