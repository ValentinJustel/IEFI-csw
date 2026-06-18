"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Plus, Bell, Clock, Calendar, BellOff, Pencil, Trash2, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Reminder {
  id: number
  habitName: string
  habitIcon: string
  time: string
  days: string[]
  enabled: boolean
  nextTrigger: string
}

const initialReminders: Reminder[] = [
  { id: 1, habitName: "Meditar", habitIcon: "🧘", time: "07:00", days: ["L", "M", "X", "J", "V", "S", "D"], enabled: true, nextTrigger: "Mañana a las 07:00" },
  { id: 2, habitName: "Ejercicio", habitIcon: "💪", time: "08:00", days: ["L", "M", "X", "J", "V"], enabled: true, nextTrigger: "Mañana a las 08:00" },
  { id: 3, habitName: "Leer 30 min", habitIcon: "📚", time: "21:00", days: ["L", "M", "X", "J", "V", "S", "D"], enabled: true, nextTrigger: "Hoy a las 21:00" },
  { id: 4, habitName: "Journaling", habitIcon: "✍️", time: "22:00", days: ["L", "M", "X", "J", "V", "S", "D"], enabled: false, nextTrigger: "Desactivado" },
  { id: 5, habitName: "Yoga", habitIcon: "🧘‍♀️", time: "06:30", days: ["L", "X", "V"], enabled: true, nextTrigger: "Viernes a las 06:30" },
  { id: 6, habitName: "Aprender idioma", habitIcon: "🌍", time: "13:00", days: ["L", "M", "X", "J", "V"], enabled: true, nextTrigger: "Mañana a las 13:00" },
]

const upcomingReminders = [
  { time: "21:00", habit: "Leer 30 min", icon: "📚", timeUntil: "En 2 horas" },
  { time: "22:00", habit: "Journaling", icon: "✍️", timeUntil: "En 3 horas" },
  { time: "07:00", habit: "Meditar", icon: "🧘", timeUntil: "Mañana" },
  { time: "08:00", habit: "Ejercicio", icon: "💪", timeUntil: "Mañana" },
]

const weekDays = [
  { value: "L", label: "L" },
  { value: "M", label: "M" },
  { value: "X", label: "X" },
  { value: "J", label: "J" },
  { value: "V", label: "V" },
  { value: "S", label: "S" },
  { value: "D", label: "D" },
]

export function RemindersView() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newReminder, setNewReminder] = useState({
    habit: "",
    time: "",
    days: ["L", "M", "X", "J", "V"],
  })

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const activeReminders = reminders.filter(r => r.enabled).length
  const totalReminders = reminders.length

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recordatorios Activos
            </CardTitle>
            <Bell className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReminders}</div>
            <p className="text-xs text-muted-foreground">de {totalReminders} totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próximo Recordatorio
            </CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21:00</div>
            <p className="text-xs text-muted-foreground">Leer 30 min</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hoy Programados
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">recordatorios</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reminders List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mis Recordatorios</CardTitle>
                  <CardDescription>Configura cuándo recibir notificaciones</CardDescription>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus data-icon="inline-start" />
                      Nuevo Recordatorio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Crear Recordatorio</DialogTitle>
                      <DialogDescription>
                        Configura un nuevo recordatorio para tus hábitos.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="habit">Hábito</Label>
                        <Select
                          value={newReminder.habit}
                          onValueChange={(value) => setNewReminder({ ...newReminder, habit: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un hábito" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="meditar">🧘 Meditar</SelectItem>
                              <SelectItem value="ejercicio">💪 Ejercicio</SelectItem>
                              <SelectItem value="leer">📚 Leer 30 min</SelectItem>
                              <SelectItem value="agua">💧 Beber agua</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Hora</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newReminder.time}
                          onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Días</Label>
                        <ToggleGroup
                          type="multiple"
                          value={newReminder.days}
                          onValueChange={(value) => setNewReminder({ ...newReminder, days: value })}
                          className="justify-start"
                        >
                          {weekDays.map((day) => (
                            <ToggleGroupItem
                              key={day.value}
                              value={day.value}
                              aria-label={day.label}
                              className="size-9"
                            >
                              {day.label}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => setIsCreateOpen(false)}>
                        Crear Recordatorio
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 transition-colors",
                      reminder.enabled ? "bg-card" : "bg-muted/50 opacity-60"
                    )}
                  >
                    <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-2xl">
                      {reminder.habitIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{reminder.habitName}</h3>
                        {!reminder.enabled && (
                          <Badge variant="secondary">
                            <BellOff className="mr-1 size-3" />
                            Pausado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {reminder.time}
                        </span>
                        <span className="flex gap-1">
                          {reminder.days.map((day) => (
                            <span key={day} className="text-xs">{day}</span>
                          ))}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {reminder.nextTrigger}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => toggleReminder(reminder.id)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="size-8 p-0">
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Opciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem>
                              <Pencil data-icon="inline-start" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 data-icon="inline-start" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Reminders Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Próximos Recordatorios</CardTitle>
              <CardDescription>Las siguientes 24 horas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {upcomingReminders.map((reminder, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-lg">
                      {reminder.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reminder.habit}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {reminder.time} - {reminder.timeUntil}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Configuración Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Modo No Molestar</p>
                    <p className="text-xs text-muted-foreground">22:00 - 07:00</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sonido</p>
                    <p className="text-xs text-muted-foreground">Notificación suave</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Vibración</p>
                    <p className="text-xs text-muted-foreground">Al recibir recordatorio</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
