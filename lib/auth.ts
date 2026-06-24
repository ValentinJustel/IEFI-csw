import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "@/lib/mongodb";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const db = await getDb();

export const auth = betterAuth({
  appName: "Habitly",
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
  "https://iefi-csw.vercel.app",
  "https://*.vercel.app",
  "http://localhost:3000",
],

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : undefined,

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const db = await getDb();
            await db.collection("user_profiles").insertOne({
              userId: user.id,
              email: user.email,
              name: user.name ?? "",
              plan: "free",
              onboardingDone: false,
              createdAt: new Date(),
            });
          } catch (error) {
            console.error("[Auth] Error al crear perfil:", error);
          }
        },
      },
    },
  },
});
