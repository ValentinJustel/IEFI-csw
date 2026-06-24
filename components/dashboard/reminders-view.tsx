"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Clock, Plus, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Habit {
  id: string
  name: string
  color: string
  icon?: string | null
}

interface Reminder {
  id: string
  habitId?: string | null
  time: string
  days: number[]
  isActive: boolean
  habit?: Habit | null
}

const DAYS_MAP = ["D", "L", "M", "X", "J", "V", "S"]

export function RemindersView() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [habits, setHabits] = useState<Habit[]>([]) 
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Formulario
  const [selectedHabitId, setSelectedHabitId] = useState<string>("")
  const [time, setTime] = useState<string>("08:00")
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]) 

  // Cargar datos sincronizados desde la base de datos
  async function loadData() {
    try {
      const [resReminders, resHabits] = await Promise.all([
        fetch("/api/reminders"),
        fetch("/api/habits") 
      ])

      if (resReminders.ok) setReminders(await resReminders.json())
      if (resHabits.ok) setHabits(await resHabits.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex))
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort())
    }
  }

  async function handleCreateReminder() {
    if (!selectedHabitId || !time) return
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId: selectedHabitId,
          time,
          days: selectedDays
        })
      })

      if (res.ok) {
        await loadData() // Recarga la lista real de la base de datos
        setIsOpen(false)
        setSelectedHabitId("")
        setTime("08:00")
        setSelectedDays([1, 2, 3, 4, 5])
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Cambiar el estado del Switch (Activo/Inactivo) en la DB de forma real
  async function handleToggleReminder(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus
    
    // Cambiamos el estado visualmente rápido en el cliente
    setReminders(reminders.map(r => r.id === id ? { ...r, isActive: newStatus } : r))

    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus })
      })

      if (!res.ok) throw new Error("Error al guardar en el servidor")
    } catch (err) {
      console.error(err)
      loadData() // Deshace el cambio si falló el backend
    }
  }

  // Eliminar definitivamente del estado y de MongoDB
  async function handleDeleteReminder(id: string) {
    setReminders(reminders.filter(r => r.id !== id))
    try {
      await fetch(`/api/reminders/${id}`, { method: "DELETE" })
    } catch (err) {
      console.error(err)
      loadData() // Deshace el borrado si falló la red
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Indicadores Dinámicos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recordatorios Activos</CardTitle>
            <Bell className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reminders.filter(r => r.isActive).length} de {reminders.length} totales</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próximo Recordatorio</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reminders.length > 0 ? reminders[0].time : "--:--"}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mis Recordatorios</CardTitle>
              <CardDescription>Configura las alertas de tus hábitos reales</CardDescription>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 size-4" /> Nuevo Recordatorio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Vincular Alerta</DialogTitle>
                  <DialogDescription>Elige uno de tus hábitos reales para ponerle una alarma.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Seleccionar Hábito</Label>
                    <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un hábito..." />
                      </SelectTrigger>
                      <SelectContent>
                        {habits.map((h) => (
                          <SelectItem key={h.id} value={h.id}>
                            <span className="mr-2">{h.icon || "🎯"}</span>
                            {h.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Hora</Label>
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Días</Label>
                    <div className="flex gap-1 justify-between">
                      {DAYS_MAP.map((day, i) => (
                        <button
                          key={i}
                          type="button"
                          className={cn(
                            "size-9 rounded-lg border text-xs font-semibold transition-colors",
                            selectedDays.includes(i) ? "bg-primary text-primary-foreground border-primary" : "bg-background"
                          )}
                          onClick={() => toggleDay(i)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleCreateReminder} disabled={!selectedHabitId}>Configurar Alerta</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2 text-lg font-medium">No hay recordatorios configurados</p>
              <p className="text-sm">Haz clic en "Nuevo Recordatorio" para asignarle una alarma a tus hábitos creados.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reminders.map((reminder) => {
                const habitName = reminder.habit?.name || "Hábito Desconocido"
                const habitIcon = reminder.habit?.icon || "🔔"
                const habitColor = reminder.habit?.color || "#6366f1"

                return (
                  <div key={reminder.id} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-4">
                      <div 
                        className="flex size-11 items-center justify-center rounded-xl text-2xl"
                        style={{ backgroundColor: `${habitColor}15`, color: habitColor }}
                      >
                        {habitIcon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{habitName}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ⏰ {reminder.time} • {reminder.days.map(d => DAYS_MAP[d]).join(" ")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Corregido: onCheckedChange ahora gatilla el cambio real en base de datos */}
                      <Switch 
                        checked={reminder.isActive} 
                        onCheckedChange={() => handleToggleReminder(reminder.id, reminder.isActive)}
                      />
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDeleteReminder(reminder.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}