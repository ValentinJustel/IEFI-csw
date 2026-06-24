import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "@/lib/mongodb";
import { Resend } from "resend";

// Inicializamos Resend usando la variable de entorno (Configúrala en tu .env)
const resend = new Resend(process.env.RESEND_API_KEY);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  appName: "Habitly",
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(await getDb()),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  // INTEGRACIÓN DE CORREO PARA RECUPERACIÓN Y VERIFICACIÓN
  emailVerification: {
    enabled: true,
    sendVerificationEmail: async (data, request) => {
      await resend.emails.send({
        from: "Habitly <no-responder@tudominio.com>", // Usa tu dominio verificado en Resend
        to: data.user.email,
        subject: "Verifica tu cuenta en Habitly",
        html: `<p>Hola, haz clic en el siguiente enlace para verificar tu cuenta:</p><a href="${data.url}">Verificar cuenta</a>`,
      });
    },
  },

  forgetPassword: {
    sendResetPasswordEmail: async (data, request) => {
      await resend.emails.send({
        from: "Habitly <no-responder@tudominio.com>",
        to: data.email,
        subject: "Recupera tu contraseña de Habitly",
        html: `<p>Hola, haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${data.url}">Restablecer contraseña</a>`,
      });
    },
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
            console.log(`[Auth] Perfil creado para: ${user.email}`);
          } catch (error) {
            console.error("[Auth] Error al crear perfil:", error);
          }
        },
      },
    },
  },
});