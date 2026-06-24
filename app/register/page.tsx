"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { signUp } from "@/lib/auth-client"

function HabitlyLogo({ inverted = false }: { inverted?: boolean }) {
  const textColor = inverted ? "text-primary-foreground" : "text-foreground"
  const accentColor = inverted ? "bg-primary-foreground" : "bg-accent"
  const dotColor = inverted ? "bg-primary-foreground/30" : "bg-accent/30"
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative size-7 flex items-end justify-center gap-[3px]">
        <span className={`w-[5px] h-3 rounded-full ${dotColor}`} />
        <span className={`w-[5px] h-5 rounded-full ${accentColor}`} />
        <span className={`w-[5px] h-4 rounded-full ${dotColor}`} />
        <span className={`w-[5px] h-6 rounded-full ${accentColor}`} />
      </div>
      <span className={`text-base font-semibold tracking-tight ${textColor}`}>Habitly</span>
    </div>
  )
}

function RuleItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={cn("flex items-center gap-2 text-xs transition-colors duration-200", met ? "text-foreground" : "text-muted-foreground/50")}>
      <span className={cn("size-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200", met ? "border-accent bg-accent" : "border-border")}>
        {met && <Check className="size-2 text-accent-foreground stroke-[3]" />}
      </span>
      {label}
    </li>
  )
}

const STATS = [
  { value: "10k+", label: "Hábitos completados hoy" },
  { value: "94%", label: "Retención al tercer mes" },
  { value: "Gratis", label: "Para siempre en el plan base" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    match: password.length > 0 && password === confirm,
  }
  const allRulesMet = rules.length && rules.uppercase && rules.number && rules.match

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!firstName || !lastName || !email) {
      setError("Por favor completá todos los campos.")
      return
    }
    if (!allRulesMet) {
      setError("La contraseña no cumple los requisitos.")
      return
    }

    setLoading(true)

    const { error: signUpError } = await signUp.email({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(
        signUpError.message === "User already exists"
          ? "Ya existe una cuenta con ese correo."
          : "Ocurrió un error al crear la cuenta. Intentá de nuevo."
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
        <HabitlyLogo inverted />
        <div className="relative space-y-10">
          <div className="space-y-3">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full" style={{ backgroundColor: "oklch(0.65 0.15 25 / 0.18)", color: "oklch(0.65 0.15 25)" }}>Empieza gratis hoy</span>
            <h2 className="text-4xl xl:text-[2.6rem] font-light leading-[1.12] text-balance" style={{ color: "oklch(0.97 0.005 85)" }}>Únete a miles que ya transformaron su rutina.</h2>
          </div>
          <ul className="space-y-5">
            {STATS.map(({ value, label }) => (
              <li key={label} className="flex items-baseline gap-4">
                <span className="text-2xl font-semibold tabular-nums w-20 shrink-0" style={{ color: "oklch(0.65 0.15 25)" }}>{value}</span>
                <span className="text-sm leading-snug" style={{ color: "oklch(0.97 0.005 85 / 0.5)" }}>{label}</span>
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
          <HabitlyLogo />
          <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Iniciar sesión</Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-[400px] space-y-7">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Crear tu cuenta</h1>
              <p className="text-sm text-muted-foreground">Gratis para siempre. Sin tarjeta de crédito.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5">
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="first-name" className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Nombre</Label>
                  <Input id="first-name" type="text" placeholder="Juan" autoComplete="given-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 bg-muted/50 border-border focus-visible:ring-ring/30 placeholder:text-muted-foreground/40" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="last-name" className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Apellido</Label>
                  <Input id="last-name" type="text" placeholder="Pérez" autoComplete="family-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 bg-muted/50 border-border focus-visible:ring-ring/30 placeholder:text-muted-foreground/40" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="nombre@correo.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 bg-muted/50 border-border focus-visible:ring-ring/30 placeholder:text-muted-foreground/40" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Contraseña</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 pr-10 bg-muted/50 border-border focus-visible:ring-ring/30 placeholder:text-muted-foreground/40" />
                  <button type="button" aria-label={showPassword ? "Ocultar" : "Mostrar"} onClick={() => setShowPassword((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <ul className="mt-2 space-y-1.5 pl-px">
                    <RuleItem met={rules.length} label="Mínimo 8 caracteres" />
                    <RuleItem met={rules.uppercase} label="Al menos una mayúscula" />
                    <RuleItem met={rules.number} label="Al menos un número" />
                  </ul>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Confirmar contraseña</Label>
                <div className="relative">
                  <Input id="confirm" type={showConfirm ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-10 pr-10 bg-muted/50 border-border focus-visible:ring-ring/30 placeholder:text-muted-foreground/40" />
                  <button type="button" aria-label={showConfirm ? "Ocultar" : "Mostrar"} onClick={() => setShowConfirm((v) => !v)} className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    {showConfirm ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
                {confirm.length > 0 && (
                  <ul className="mt-2 pl-px">
                    <RuleItem met={rules.match} label="Las contraseñas coinciden" />
                  </ul>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full h-10 font-medium bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-60">
                {loading ? "Creando cuenta..." : "Crear cuenta"}
                {!loading && <ArrowRight data-icon="inline-end" />}
              </Button>

              <p className="text-center text-xs text-muted-foreground/60 leading-relaxed">
                Al registrarte aceptás nuestros{" "}
                <Link href="#" className="underline underline-offset-2 hover:text-accent transition-colors">Términos de servicio</Link>{" "}
                y{" "}
                <Link href="#" className="underline underline-offset-2 hover:text-accent transition-colors">Política de privacidad</Link>.
              </p>
            </form>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">¿Ya tenés cuenta?</span>
              <Separator className="flex-1" />
            </div>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors">
                Iniciar sesión
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <footer className="px-6 pb-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground/60 text-center">&copy; {new Date().getFullYear()} Habitly. Todos los derechos reservados.</p>
        </footer>
      </section>
    </main>
  )
}