"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Bell, Palette, Shield, Download } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-5" />
            <CardTitle>Perfil</CardTitle>
          </div>
          <CardDescription>Gestiona tu información personal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="size-20">
              <AvatarImage src="/avatars/user.jpg" alt="Usuario" />
              <AvatarFallback className="text-2xl">MG</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">Cambiar foto</Button>
              <p className="text-xs text-muted-foreground">JPG, PNG. Máximo 2MB.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue="María García" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="maria@ejemplo.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Zona horaria</Label>
              <Select defaultValue="europe-madrid">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="europe-madrid">Europa/Madrid (UTC+1)</SelectItem>
                    <SelectItem value="america-mexico">América/México (UTC-6)</SelectItem>
                    <SelectItem value="america-bogota">América/Bogotá (UTC-5)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Idioma</Label>
              <Select defaultValue="es">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
            <Button>Guardar cambios</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-5" />
            <CardTitle>Notificaciones</CardTitle>
          </div>
          <CardDescription>Configura cómo recibir alertas y recordatorios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recordatorios de hábitos</p>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones para completar tus hábitos
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Resumen diario</p>
                <p className="text-sm text-muted-foreground">
                  Recibe un resumen de tu progreso cada noche
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Logros y rachas</p>
                <p className="text-sm text-muted-foreground">
                  Notificaciones cuando alcances nuevos logros
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Actividad de comunidad</p>
                <p className="text-sm text-muted-foreground">
                  Actualizaciones de tus comunidades
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Emails promocionales</p>
                <p className="text-sm text-muted-foreground">
                  Novedades y ofertas especiales
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="size-5" />
            <CardTitle>Apariencia</CardTitle>
          </div>
          <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema oscuro</p>
                <p className="text-sm text-muted-foreground">
                  Activa el modo oscuro para reducir fatiga visual
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label>Día de inicio de semana</Label>
              <Select defaultValue="monday">
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
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

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-5" />
            <CardTitle>Privacidad y Seguridad</CardTitle>
          </div>
          <CardDescription>Gestiona tu seguridad y datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Perfil público</p>
                <p className="text-sm text-muted-foreground">
                  Permitir que otros usuarios vean tu perfil
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mostrar en leaderboards</p>
                <p className="text-sm text-muted-foreground">
                  Aparecer en rankings de comunidades
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticación de dos factores</p>
                <p className="text-sm text-muted-foreground">
                  Añade una capa extra de seguridad
                </p>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cambiar contraseña</p>
                <p className="text-sm text-muted-foreground">
                  Actualiza tu contraseña de acceso
                </p>
              </div>
              <Button variant="outline" size="sm">Cambiar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="size-5" />
            <CardTitle>Exportar Datos</CardTitle>
          </div>
          <CardDescription>Descarga una copia de todos tus datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Exporta tus hábitos, progreso y configuración en formato JSON o CSV.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Exportar JSON</Button>
              <Button variant="outline" size="sm">Exportar CSV</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
          <CardDescription>Acciones irreversibles en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Eliminar cuenta</p>
              <p className="text-sm text-muted-foreground">
                Esta acción eliminará permanentemente tu cuenta y todos tus datos
              </p>
            </div>
            <Button variant="destructive" size="sm">Eliminar cuenta</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
