import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function getSession() {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getAuthenticatedUserId() {
  const session = await getSession();
  return session?.user?.id ?? null;
}

export async function requireAuth() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return {
      userId: null as null,
      error: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
    };
  }
  return {
    userId: userId as string,
    error: null as null,
  };
}
