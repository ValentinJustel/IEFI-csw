"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  Clock,
  Plus
} from "lucide-react"
import { HabitCard } from "./habit-card"
import { WeeklyChart } from "./weekly-chart"
import { ActivityHeatmap } from "./activity-heatmap"

const todayHabits = [
  { id: 1, name: "Meditar", icon: "🧘", streak: 15, time: "07:00", completed: true, category: "Bienestar" },
  { id: 2, name: "Ejercicio", icon: "💪", streak: 8, time: "08:00", completed: true, category: "Salud" },
  { id: 3, name: "Leer 30 min", icon: "📚", streak: 22, time: "21:00", completed: false, category: "Desarrollo" },
  { id: 4, name: "Beber 2L agua", icon: "💧", streak: 30, time: "Todo el día", completed: false, category: "Salud" },
  { id: 5, name: "Journaling", icon: "✍️", streak: 5, time: "22:00", completed: false, category: "Bienestar" },
]

const stats = [
  { title: "Hábitos Activos", value: "12", icon: Target, change: "+2 este mes" },
  { title: "Racha Máxima", value: "30 días", icon: Flame, change: "Beber agua" },
  { title: "Tasa de Éxito", value: "87%", icon: TrendingUp, change: "+5% vs semana pasada" },
  { title: "Días Consecutivos", value: "15", icon: Calendar, change: "Sigue así" },
]

export function DashboardOverview() {
  const completedToday = todayHabits.filter(h => h.completed).length
  const totalToday = todayHabits.length
  const progressPercent = (completedToday / totalToday) * 100

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progreso de Hoy</CardTitle>
              <CardDescription>
                {completedToday} de {totalToday} hábitos completados
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {Math.round(progressPercent)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Habits */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hábitos de Hoy</CardTitle>
                  <CardDescription>Completa tus hábitos diarios</CardDescription>
                </div>
                <Button size="sm">
                  <Plus data-icon="inline-start" />
                  Nuevo Hábito
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {todayHabits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="flex flex-col gap-6">
          {/* Weekly Progress Chart */}
          <WeeklyChart />

          {/* Upcoming Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Próximos Recordatorios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-secondary">
                    <Clock className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Leer 30 min</p>
                    <p className="text-xs text-muted-foreground">En 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-secondary">
                    <Clock className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Journaling</p>
                    <p className="text-xs text-muted-foreground">En 4 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap />
    </div>
  )
}
