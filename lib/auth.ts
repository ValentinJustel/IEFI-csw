import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "@/lib/mongodb";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Lazy init — no await a nivel de módulo
const dbPromise = getDb();

export const auth = betterAuth({
  appName: "Habitly",
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "https://iefi-csw.vercel.app",
    "https://*.vercel.app",
    "http://localhost:3000",
  ],
  database: mongodbAdapter(await dbPromise),  // ← sigue siendo el problema
  ...
});
