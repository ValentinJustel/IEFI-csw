"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <button onClick={async () => {
        await signOut();
        router.push("/"); // Vuelve al inicio tras cerrar sesión
      }}>
        Cerrar Sesión
      </button>
    );
  }

  return (
    <button onClick={() => router.push("/login")}>
      Iniciar Sesión
    </button>
  );
}