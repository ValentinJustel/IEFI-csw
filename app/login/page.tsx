"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signIn } from "@/lib/auth-client"

function HabitlyLogo({ inverted = false, className = "" }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 transition-transform hover:scale-[1.02] duration-200 ${className}`}>
      <svg width={38} height={38} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="loginLogoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path d="M25 20C25 14.4772 29.4772 10 35 10C40.5228 10 45 14.4772 45 20V45C45 45 35 45 30 50C25 55 25 65 25 80C25 85.5228 20.5228 90 15 90C9.47715 90 5 85.5228 5 80C5 55 15 20 25 20Z" fill="url(#loginLogoGradient)" opacity="0.85" />
        <path d="M75 80C75 85.5228 70.5228 90 65 90C59.4772 90 55 85.5228 55 80V50C55 40 68 35 75 45C82 55 80 68 70 72C60 76 50 65 50 50V20C50 14.4772 54.4772 10 60 10C65.5228 10 70 14.4772 70 20C70 40 85 45 91 55C97 65 95 80 75 80Z" fill="url(#loginLogoGradient)" />
        <circle cx="50" cy="22" r="6" fill="#ec4899" />
      </svg>
      <span className={`text-2xl font-bold tracking-tight ${inverted ? "text-white" : "bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"}`}>
        Habitly
      </span>
    </Link>
  )
}

const PANEL_FEATURES = [
  "Registra hábitos diarios en segundos",
  "Visualiza tu progreso con streaks",
  "Recibe recordatorios personalizados",
  "Accede desde cualquier dispositivo",
]

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Por favor completá todos los campos.")
      return
    }

    setLoading(true)

    const { error: signInError } = await signIn.email({
      email: email.trim(),
      password,
    })

    setLoading(false)

    console.log("signInError:", signInError) // ← temporal para debug

    if (signInError) {
      setError(
        signInError.message === "Invalid credentials"
          ? "Correo o contraseña incorrectos."
          : `Error: ${signInError.message}`
      )
      return
    }

    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen flex bg-background">
      <aside aria-hidden="true" className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative overflow-hidden flex-col justify-between p-12" style={{ backgroundColor: "oklch(0.25 0.02 30)" }}>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, oklch(1 0 0 / 0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full blur-3xl" style={{ backgroundColor: "oklch(0.65 0.15 25 / 0.15)" }} />
        <HabitlyLogo inverted className="w-fit" />
        <div className="relative space-y-10">
          <div className="space-y-3">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full" style={{ backgroundColor: "oklch(0.65 0.15 25 / 0.18)", color: "oklch(0.65 0.15 25)" }}>Tu nueva rutina empieza hoy</span>
            <h2 className="text-4xl xl:text-[2.6rem] font-light leading-[1.12] text-balance" style={{ color: "oklch(0.97 0.005 85)" }}>Construye hábitos que realmente duran.</h2>
          </div>
          <ul className="space-y-4">
            {PANEL_FEATURES.map((feat) => (
              <li key={feat} className="flex items-center gap-3">
                <CheckCircle2 className="size-4 shrink-0" style={{ color: "oklch(0.65 0.15 25)" }} />
                <span className="text-sm leading-snug" style={{ color: "oklch(0.97 0.005 85 / 0.6)" }}>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-wrap gap-2">
          {["Sin tarjeta de crédito", "Cancela cuando quieras", "Datos seguros"].map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs" style={{ border: "1px solid oklch(1 0 0 / 0.1)", color: "oklch(0.97 0.005 85 / 0.4)" }}>
              <span className="size-1.5 rounded-full" style={{ backgroundColor: "oklch(0.65 0.15 25 / 0.5)" }} />
              {tag}
            </span>
          ))}
        </div>
      </aside>

      <section className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <HabitlyLogo className="w-fit" />
          <Link href="/register" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Crear cuenta</Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-[380px] space-y-8">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Bienvenido de vuelta</h1>
              <p className="text-sm text-muted-foreground">Ingresá tus credenciales para continuar.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="nombre@correo.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 bg-muted/50 border-border" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Contraseña</Label>
                  <Link href="#" className="text-xs text-accent hover:opacity-80 transition-opacity font-medium">¿La olvidaste?</Link>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 pr-10 bg-muted/50 border-border" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/50 hover:text-muted-foreground">
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-10 font-medium bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-60">
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                {!loading && <ArrowRight className="ml-2 size-4" />}
              </Button>
            </form>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">¿No tenés cuenta?</span>
              <Separator className="flex-1" />
            </div>

            <div className="text-center">
              <Link href="/register" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors">
                Crear una cuenta gratis <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <footer className="px-6 pb-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground/60 text-center">
            &copy; {new Date().getFullYear()} Habitly. Al iniciar sesión aceptás nuestros{" "}
            <Link href="#" className="hover:text-accent underline underline-offset-2">Términos</Link>{" "}
            y{" "}
            <Link href="#" className="hover:text-accent underline underline-offset-2">Privacidad</Link>.
          </p>
        </footer>
      </section>
    </main>
  )
}
