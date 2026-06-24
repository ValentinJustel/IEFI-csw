import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth maneja todos los endpoints de auth automáticamente:
//   POST /api/auth/sign-up/email   → registro
//   POST /api/auth/sign-in/email   → login
//   POST /api/auth/sign-out        → logout
//   GET  /api/auth/session         → sesión actual
//   GET  /api/auth/callback/google → OAuth callback
//
// El hook `after` en auth.ts se dispara luego del registro.

export const { GET, POST } = toNextJsHandler(auth.handler);