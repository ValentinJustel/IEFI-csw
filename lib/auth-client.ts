import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient({});

export const { signIn, signUp, signOut, useSession } = auth;
