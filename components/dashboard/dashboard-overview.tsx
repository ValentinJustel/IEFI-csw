"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// 💎 CORRECCIÓN: Quitamos ChartTooltip de 'recharts' y usamos el sistema de shadcn/ui correctamente
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { CheckCircle2, Circle, Flame, TrendingUp, Calendar, Percent, Loader2 } from "lucide-react"

// 💎 CORRECCIÓN: Agregamos la interfaz real de Tracking para que TypeScript no chille
interface TrackingItem {
  id: string
  habitId: string
  userId: string
  completedAt: string | Date
  note?: string | null
}

interface Habit {
  _id?: string
  id?: string
  name: string
  time?: string
  streak?: number
  category?: string
  completed?: boolean
  completedToday?: boolean
  // 💎 CORRECCIÓN: Le aclaramos a TypeScript que 'tracking' viene incluido opcionalmente desde Prisma
  tracking?: TrackingItem[]
}

const weeklyConfig = {
  completed: {
    label: "Completados",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function DashboardView() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Llamamos a tu API de hábitos
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch("/api/habits")
        if (res.ok) {
          const fetchedData = await res.json()
          setHabits(Array.isArray(fetchedData) ? fetchedData : fetchedData.habits || [])
        }
      } catch (error) {
        console.error("Error al traer tus hábitos reales:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHabits()
  }, [])

  // 2. Función para alternar el estado de completado
  const handleToggleComplete = async (habitId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      })

      if (res.ok) {
        setHabits(prev =>
          prev.map(h => {
            const id = h._id || h.id
            if (id === habitId) {
              return { ...h, completedToday: !currentStatus, completed: !currentStatus }
            }
            return h
          })
        )
      }
    } catch (error) {
      console.error("Error al actualizar el hábito:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="size-9 animate-spin text-muted-foreground"/>
        <p className="text-sm text-muted-foreground animate-pulse">Conectando con tus hábitos reales...</p>
      </div>
    )
  }

  // 3. Procesamos los hábitos y sus estados usando el tracking mapeado de Prisma
  const habitsToday = habits.map(h => {
    const todayStr = new Date().toLocaleDateString("en-CA")

    const hasTrackingToday = h.tracking && Array.isArray(h.tracking) && h.tracking.some((t: TrackingItem) => {
      if (!t.completedAt) return false
      const trackingDateStr = new Date(t.completedAt).toLocaleDateString("en-CA")
      return trackingDateStr === todayStr
    })

    return {
      id: h._id || h.id || Math.random().toString(),
      name: h.name,
      time: h.time || "Todo el día",
      streak: h.streak || (h.tracking ? h.tracking.length : 0),
      category: h.category || "General",
      completed: h.completedToday === true || h.completed === true || !!hasTrackingToday
    }
  })

  // ─── CÁLCULOS DE MÉTRICAS COORDINADAS ──────────────────────────────────────
  const activeHabits = habits.length
  const todayCompletedCount = habitsToday.filter(h => h.completed).length
  const todayTotalCount = habitsToday.length
  const todayProgress = todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0
  
  const maxStreak = habits.reduce((max, h) => {
    const currentStreak = h.streak || (h.tracking ? h.tracking.length : 0)
    return currentStreak > max ? currentStreak : max
  }, 0)

  const topHabit = habits.find(h => {
    const currentStreak = h.streak || (h.tracking ? h.tracking.length : 0)
    return currentStreak === maxStreak
  })
  const maxStreakHabit = maxStreak > 0 && topHabit ? topHabit.name : "Sin registros"

  // ─── GENERACIÓN DE DATOS REALES PARA EL GRÁFICO SEMANAL ────────────────────
  const getWeeklyData = () => {
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    const data = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      
      const dayLabel = daysOfWeek[d.getDay()]
      const dateStr = d.toLocaleDateString("en-CA")

      let completedOnThisDay = 0
      habits.forEach(h => {
        if (h.tracking && Array.isArray(h.tracking)) {
          const hasTracking = h.tracking.some((t: TrackingItem) => {
            if (!t.completedAt) return false
            return new Date(t.completedAt).toLocaleDateString("en-CA") === dateStr
          })
          if (hasTracking) completedOnThisDay++
        }
      })

      data.push({
        name: dayLabel,
        completed: completedOnThisDay,
      })
    }
    return data
  }

  const weeklyData = getWeeklyData()

  return (
    <div className="flex flex-col gap-6">
      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hábitos Activos</CardTitle>
            <Calendar className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeHabits}</div>
            <p className="text-xs text-muted-foreground">En tu cuenta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Racha Máxima</CardTitle>
            <Flame className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maxStreak} días</div>
            <p className="text-xs text-muted-foreground truncate">{maxStreakHabit}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Éxito</CardTitle>
            <Percent className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayProgress}%</div>
            <p className="text-xs text-muted-foreground">Progreso actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Días Consecutivos</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maxStreak}</div>
            <p className="text-xs text-muted-foreground">¡A mantenerlo!</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Progreso Global de Hoy */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">Progreso de Hoy</p>
              <p className="text-xs text-muted-foreground">
                {todayCompletedCount} de {todayTotalCount} hábitos completados
              </p>
            </div>
            <span className="text-sm font-bold text-muted-foreground">{todayProgress}%</span>
          </div>
          
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300" 
              style={{ width: `${todayProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Panel Central */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna Izquierda: Lista de Hábitos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Hábitos de Hoy</h3>
              <p className="text-sm text-muted-foreground">Tus registros reales de MongoDB</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {habitsToday.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12 bg-card rounded-lg border border-dashed">
                No tenés hábitos creados todavía. ¡Andá a la pestaña de "Mis Hábitos" para sumar el primero!
              </p>
            ) : (
              habitsToday.map((habit) => (
                <Card className="transition-all hover:bg-muted/50" key={habit.id}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold">
                        {habit.category}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${habit.completed ? "line-through text-muted-foreground" : ""}`}>
                          {habit.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{habit.time}</span>
                          <span className="flex items-center gap-0.5">
                            <Flame className="size-3 text-accent"/> {habit.streak} días
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant={habit.completed ? "ghost" : "outline"} 
                      size="sm" 
                      className="gap-1.5 shrink-0"
                      onClick={() => handleToggleComplete(habit.id, habit.completed)}
                    >
                      {habit.completed ? (
                        <>
                          <CheckCircle2 className="size-4 text-green-600"/>
                          <span>Completado</span>
                        </>
                      ) : (
                        <>
                          <Circle className="size-4"/>
                          <span>Completar</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Columna Derecha: Resumen Semanal de Recharts */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Resumen Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              {activeHabits === 0 ? (
                <div className="text-xs text-muted-foreground py-12 text-center">
                  Sin datos de seguimiento esta semana.
                </div>
              ) : (
                <div className="h-[200px] w-full mt-4">
                  <ChartContainer config={weeklyConfig} className="h-full w-full">
                    <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="completed" 
                        fill="var(--color-completed)" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-4 text-center border-t pt-3">
                Hoy completaste <strong>{todayCompletedCount}</strong> de <strong>{todayTotalCount}</strong> hábitos.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}