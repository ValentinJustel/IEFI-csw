"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth-client";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Better Auth suele pasar el token por URL
  
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Si no hay token en la URL, el usuario no puede resetear la contraseña
    if (!token) {
      setError("Token de recuperación inválido o expirado.");
      setLoading(false);
      return;
    }

    const { error: resetError } = await auth.resetPassword({
      newPassword: password,
    });

    setLoading(false);

    if (resetError) {
      setError("Error al actualizar la contraseña. Inténtalo de nuevo.");
    } else {
      // Éxito: redirigimos al login
      router.push("/login?passwordReset=true");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[380px] space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Nueva contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu nueva contraseña para acceder a tu cuenta.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nueva contraseña</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Actualizando..." : "Restablecer contraseña"}
            {!loading && <Lock className="ml-2 size-4" />}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}