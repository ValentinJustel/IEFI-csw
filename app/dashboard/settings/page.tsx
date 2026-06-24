"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { User, Bell, Palette, Shield, Download, Check, LogOut, KeyRound } from "lucide-react"
// Corregido el import destructurado basándonos en el error de la imagen "image_e92f03.png"
// Reemplaza la línea 16 por esta:
import { useSession, signOut, auth } from "@/lib/auth-client";

function getInitials(name?: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

type Settings = {
  name: string
  email: string
  timezone: string
  language: string
  notifications: { habits: boolean; dailySummary: boolean; achievements: boolean; community: boolean; promotions: boolean }
  appearance: { darkMode: boolean; weekStart: string }
  privacy: { publicProfile: boolean; showInLeaderboards: boolean }
}

export default function SettingsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  
  // Estados para el cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const [settings, setSettings] = useState<Settings>({
    name: "",
    email: "",
    timezone: "america-buenos-aires",
    language: "es",
    notifications: { habits: true, dailySummary: true, achievements: true, community: false, promotions: false },
    appearance: { darkMode: false, weekStart: "monday" },
    privacy: { publicProfile: true, showInLeaderboards: true },
  })

  // Cargar preferencias guardadas
  useEffect(() => {
    fetch("/api/user/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setSettings({
            ...data,
            name: data.name || user?.name || ""
          })
        }
      })
      .catch(() => {
        if (user) setSettings(s => ({ ...s, name: user.name || "", email: user.email || "" }))
      })
      .finally(() => setLoading(false))
  }, [user])

  // Función para cerrar sesión con auth-client
  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })
  }

  async function saveProfile() {
    setSaving(true)
    await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: settings.name, timezone: settings.timezone, language: settings.language }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Cambio de contraseña usando la API nativa sin endpoints manuales propensos a 404
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Por favor completá todos los campos de contraseña.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("La nueva contraseña y la confirmación no coinciden.")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.")
      return
    }

    setPasswordLoading(true)

    // Llamada segura usando la SDK cliente
    // ... dentro de handlePasswordChange ...
    await auth.changePassword({
      newPassword: newPassword,
      currentPassword: currentPassword,
      revokeOtherSessions: true,
    }, {
// ... el resto sigue igual
      onSuccess: () => {
        setPasswordSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setPasswordLoading(false)
      },
      onError: (ctx) => {
        setPasswordError(ctx.error.message || "Error al actualizar la contraseña. Verificá tus datos.")
        setPasswordLoading(false)
      }
    })
  }

  async function savePref(patch: Partial<Settings>) {
    await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
  }

  function setNotif(key: keyof Settings["notifications"], value: boolean) {
    const updated = { ...settings.notifications, [key]: value }
    setSettings((s) => ({ ...s, notifications: updated }))
    savePref({ notifications: updated })
  }

  function setAppearance(key: keyof Settings["appearance"], value: boolean | string) {
    const updated = { ...settings.appearance, [key]: value }
    setSettings((s) => ({ ...s, appearance: updated }))
    savePref({ appearance: updated })
  }

  function setPrivacy(key: keyof Settings["privacy"], value: boolean) {
    const updated = { ...settings.privacy, [key]: value }
    setSettings((s) => ({ ...s, privacy: updated }))
    savePref({ privacy: updated })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">Cargando...</div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      
      {/* Cabecera superior con confirmación inline protegida */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
          <p className="text-sm text-muted-foreground">Ajusta tus preferencias y la seguridad de tu cuenta.</p>
        </div>
        
        <div className="flex items-center gap-2 transition-all duration-200">
          {!showSignOutConfirm ? (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setShowSignOutConfirm(true)} 
              className="gap-2"
            >
              <LogOut className="size-4" /> Cerrar sesión
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 bg-destructive/10 p-1 rounded-md border border-destructive/20 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-xs font-medium text-destructive px-2">¿Estás seguro?</span>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleSignOut}
                className="h-7 px-2.5 text-xs"
              >
                Sí, salir
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSignOutConfirm(false)}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-background"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><User className="size-5" /><CardTitle>Perfil</CardTitle></div>
          <CardDescription>Gestiona tu información personal expuesta en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="size-20">
              <AvatarImage src={user?.image ?? ""} alt={settings.name} />
              <AvatarFallback className="text-2xl">{getInitials(settings.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">Cambiar foto</Button>
              <p className="text-xs text-muted-foreground">JPG, PNG. Máximo 2MB.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" value={settings.name} onChange={(e) => setSettings((s) => ({ ...s, name: e.target.value }))} placeholder="Tu nombre" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email institucional (No modificable)</Label>
              <Input id="email" type="email" value={settings.email || user?.email || ""} disabled className="opacity-60 bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label>Zona horaria</Label>
              <Select value={settings.timezone} onValueChange={(v) => setSettings((s) => ({ ...s, timezone: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="america-buenos-aires">América/Buenos Aires (UTC-3)</SelectItem>
                    <SelectItem value="america-mexico">América/México (UTC-6)</SelectItem>
                    <SelectItem value="america-bogota">América/Bogotá (UTC-5)</SelectItem>
                    <SelectItem value="europe-madrid">Europa/Madrid (UTC+1)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Idioma</Label>
              <Select value={settings.language} onValueChange={(v) => setSettings((s) => ({ ...s, language: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={saveProfile} disabled={saving} className="min-w-[140px]">
              {saved ? <><Check className="size-4 mr-1" /> Guardado</> : saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacidad y Seguridad */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Shield className="size-5" /><CardTitle>Privacidad y Seguridad</CardTitle></div>
          <CardDescription>Gestiona tus credenciales de acceso y visualización</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Perfil público</p>
                <p className="text-sm text-muted-foreground">Permitir que otros usuarios vean tu perfil</p>
              </div>
              <Switch checked={settings.privacy.publicProfile} onCheckedChange={(v) => setPrivacy("publicProfile", v)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mostrar en leaderboards</p>
                <p className="text-sm text-muted-foreground">Aparecer en rankings de comunidades</p>
              </div>
              <Switch checked={settings.privacy.showInLeaderboards} onCheckedChange={(v) => setPrivacy("showInLeaderboards", v)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticación de dos factores</p>
                <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
          </div>

          <Separator />

          {/* Formulario de Cambio de Contraseña */}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="flex items-center gap-2 font-medium text-sm text-foreground">
              <KeyRound className="size-4" />
              <span>Cambiar contraseña de acceso</span>
            </div>
            
            {passwordError && (
              <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-md">
                Contraseña actualizada correctamente.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="curr-pass">Contraseña actual</Label>
                <Input id="curr-pass" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="new-pass">Nueva contraseña</Label>
                <Input id="new-pass" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="conf-pass">Confirmar nueva contraseña</Label>
                <Input id="conf-pass" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repetir contraseña" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="outline" disabled={passwordLoading}>
                {passwordLoading ? "Actualizando..." : "Actualizar contraseña"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Bell className="size-5" /><CardTitle>Notificaciones</CardTitle></div>
          <CardDescription>Configura cómo recibir alertas y recordatorios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {([
              { key: "habits", label: "Recordatorios de hábitos", desc: "Recibe notificaciones para completar tus hábitos" },
              { key: "dailySummary", label: "Resumen diario", desc: "Recibe un resumen de tu progreso cada noche" },
              { key: "achievements", label: "Logros y rachas", desc: "Notificaciones cuando alcances nuevos logros" },
              { key: "community", label: "Actividad de comunidad", desc: "Actualizaciones de tus comunidades" },
              { key: "promotions", label: "Emails promocionales", desc: "Novedades y ofertas especiales" },
            ] as const).map((item, i) => (
              <div key={item.key}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={settings.notifications[item.key]} onCheckedChange={(v) => setNotif(item.key, v)} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Apariencia */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Palette className="size-5" /><CardTitle>Apariencia</CardTitle></div>
          <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema oscuro</p>
                <p className="text-sm text-muted-foreground">Activa el modo oscuro para reducir fatiga visual</p>
              </div>
              <Switch checked={settings.appearance.darkMode} onCheckedChange={(v) => setAppearance("darkMode", v)} />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label>Día de inicio de semana</Label>
              <Select value={settings.appearance.weekStart} onValueChange={(v) => setAppearance("weekStart", v)}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="monday">Lunes</SelectItem>
                    <SelectItem value="sunday">Domingo</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exportar */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Download className="size-5" /><CardTitle>Exportar Datos</CardTitle></div>
          <CardDescription>Descarga una copia de todos tus datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Exporta tus hábitos, progreso y configuración en formato JSON o CSV.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Exportar JSON</Button>
              <Button variant="outline" size="sm">Exportar CSV</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zona de peligro */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          <CardDescription>Acciones irreversibles en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Eliminar cuenta</p>
              <p className="text-sm text-muted-foreground">Esta acción eliminará permanentemente tu cuenta y todos tus datos</p>
            </div>
            <Button variant="destructive" size="sm">Eliminar cuenta</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}