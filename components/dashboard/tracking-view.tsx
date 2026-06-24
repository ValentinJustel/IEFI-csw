"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Flame, Target, Calendar, Award, Loader2 } from "lucide-react"
import { ActivityHeatmap } from "./activity-heatmap"

interface AnalyticsData {
  successRate: number
  currentStreak: number
  completedThisWeek: number
  totalPossibleThisWeek: number
  bestHabit: string
  weeklyData: { day: string; completed: number; total: number }[]
  monthlyTrendData: { week: string; rate: number }[]
  habitPerformanceData: { name: string; value: number; fill: string }[]
  categoryData: { category: string; completed: number; missed: number }[]
  streakData: { habit: string; streak: number; best: number }[]
}

const weeklyChartConfig = {
  completed: {
    label: "Completados",
    color: "oklch(0.65 0.15 25)",
  },
} satisfies ChartConfig

const trendChartConfig = {
  rate: {
    label: "Tasa de éxito",
    color: "oklch(0.65 0.15 25)",
  },
} satisfies ChartConfig

const categoryChartConfig = {
  completed: {
    label: "Completados",
    color: "oklch(0.65 0.15 25)",
  },
  missed: {
    label: "Perdidos",
    color: "oklch(0.85 0.05 25)",
  },
} satisfies ChartConfig

export function TrackingView() {
  const [timeRange, setTimeRange] = useState("week")
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRealAnalytics() {
      try {
        setLoading(true)
        const res = await fetch(`/api/analytics?range=${timeRange}`)
        if (res.ok) {
          const analytics = await res.json()
          setData(analytics)
        }
      } catch (err) {
        console.error("Error cargando analíticas reales:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchRealAnalytics()
  }, [timeRange])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="size-9 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground animate-pulse">Procesando métricas de la base de datos...</p>
      </div>
    )
  }

  // Fallback seguro si la base de datos devuelve arrays vacíos
  const weeklyData = data?.weeklyData || []
  const monthlyTrendData = data?.monthlyTrendData || []
  const habitPerformanceData = data?.habitPerformanceData || []
  const categoryData = data?.categoryData || []
  const streakData = data?.streakData || []

  const currentTrend = monthlyTrendData.length > 0 ? monthlyTrendData[monthlyTrendData.length - 1].rate : 0
  const previousTrend = monthlyTrendData.length > 1 ? monthlyTrendData[monthlyTrendData.length - 2].rate : 0
  const trendDiff = currentTrend - previousTrend
  const isTrendUp = trendDiff >= 0

  return (
    <div className="flex flex-col gap-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Análisis de Progreso</h2>
          <p className="text-sm text-muted-foreground">Visualiza tu rendimiento y tendencias reales</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Últimos 3 meses</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Éxito</CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.successRate || 0}%</div>
            <div className="flex items-center gap-1 text-xs">
              {isTrendUp ? <TrendingUp className="size-3 text-green-600" /> : <TrendingDown className="size-3 text-red-600" />}
              <span className={isTrendUp ? "text-green-600" : "text-red-600"}>
                {isTrendUp ? "+" : ""}{trendDiff}%
              </span>
              <span className="text-muted-foreground">vs periodo anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Racha Actual</CardTitle>
            <Flame className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.currentStreak || 0} días</div>
            <p className="text-xs text-muted-foreground">Mantén el ritmo diario</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completados</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.completedThisWeek || 0}/{data?.totalPossibleThisWeek || 0}
            </div>
            <p className="text-xs text-muted-foreground">en el periodo seleccionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mejor Hábito</CardTitle>
            <Award className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{data?.bestHabit || "Ninguno"}</div>
            <p className="text-xs text-muted-foreground">Mayor efectividad registrada</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Hábitos Completados por Día</CardTitle>
            <CardDescription>Tu progreso diario esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={weeklyChartConfig} className="h-[250px] w-full">
              <BarChart data={weeklyData} accessibilityLayer>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia Temporal</CardTitle>
            <CardDescription>Tu tasa de éxito a lo largo de las semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendChartConfig} className="h-[250px] w-full">
              <AreaChart data={monthlyTrendData} accessibilityLayer>
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis hide domain={[0, 100]} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area dataKey="rate" type="monotone" fill="url(#fillRate)" stroke="var(--color-rate)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Categoría</CardTitle>
            <CardDescription>Comparación de hábitos por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryChartConfig} className="h-[250px] w-full">
              <BarChart data={categoryData} layout="vertical" accessibilityLayer>
                <XAxis type="number" hide />
                <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={100} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" stackId="a" />
                <Bar dataKey="missed" fill="var(--color-missed)" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Streak Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Rachas</CardTitle>
            <CardDescription>Tus hábitos con mejor consistencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {streakData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No hay registros de rachas activos.</p>
              ) : (
                streakData.map((item, index) => (
                  <div key={item.habit} className="flex items-center gap-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{item.habit}</span>
                        <div className="flex items-center gap-1">
                          <Flame className="size-3 text-accent" />
                          <span className="text-sm font-semibold">{item.streak}</span>
                        </div>
                      </div>
                      <div className="relative h-2 w-full rounded-full bg-secondary">
                        <div
                          className="absolute h-full rounded-full bg-accent"
                          style={{ width: `${item.best > 0 ? (item.streak / item.best) * 100 : 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Mejor racha: {item.best} días</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habit Performance Radial */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Individual de Hábitos</CardTitle>
          <CardDescription>Tasa de completitud por hábito</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {habitPerformanceData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center col-span-5 py-6">Crea tus primeros hábitos para ver su rendimiento individual.</p>
            ) : (
              habitPerformanceData.map((habit) => (
                <div key={habit.name} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <svg className="size-24" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={habit.fill || "oklch(0.65 0.15 25)"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${habit.value * 2.51} 251`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{habit.value}%</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-center truncate w-full">{habit.name}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <ActivityHeatmap />
    </div>
  )
}