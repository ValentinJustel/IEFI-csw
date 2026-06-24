import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient({
  baseURL: "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = auth;