import { PrismaClient } from "@prisma/client";

// ─── Singleton de Prisma ──────────────────────────────────────────────────────
// Evita instanciar múltiples clientes durante hot-reload en desarrollo.
// En producción Next.js corre en un solo proceso, esto no es problema.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// NOTA: Prisma y Better Auth apuntan a la MISMA MongoDB (misma MONGODB_URI).
// Better Auth escribe en: user, session, account, verification
// Prisma puede leer/escribir esas mismas colecciones + las tuyas propias.
// No hay duplicación de datos — son dos clientes de la misma DB.