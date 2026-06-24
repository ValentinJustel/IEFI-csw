import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(async (req) => {
  const auth = await getAuth();
  return auth.handler(req);
});
