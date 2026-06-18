"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts"
import { TrendingUp, TrendingDown, Flame, Target, Calendar, Award } from "lucide-react"
import { ActivityHeatmap } from "./activity-heatmap"
import { cn } from "@/lib/utils"

// Weekly data
const weeklyData = [
  { day: "Lun", completed: 4, total: 5 },
  { day: "Mar", completed: 5, total: 5 },
  { day: "Mié", completed: 3, total: 5 },
  { day: "Jue", completed: 5, total: 5 },
  { day: "Vie", completed: 4, total: 5 },
  { day: "Sáb", completed: 2, total: 5 },
  { day: "Dom", completed: 3, total: 5 },
]

// Monthly trend data
const monthlyTrendData = [
  { week: "Sem 1", rate: 72 },
  { week: "Sem 2", rate: 78 },
  { week: "Sem 3", rate: 85 },
  { week: "Sem 4", rate: 82 },
  { week: "Sem 5", rate: 88 },
  { week: "Sem 6", rate: 92 },
  { week: "Sem 7", rate: 87 },
  { week: "Sem 8", rate: 90 },
]

// Habit performance data
const habitPerformanceData = [
  { name: "Meditar", value: 95, fill: "oklch(0.65 0.15 25)" },
  { name: "Ejercicio", value: 85, fill: "oklch(0.55 0.15 25)" },
  { name: "Leer", value: 92, fill: "oklch(0.45 0.12 25)" },
  { name: "Agua", value: 100, fill: "oklch(0.35 0.10 25)" },
  { name: "Journaling", value: 45, fill: "oklch(0.75 0.18 25)" },
]

// Category data
const categoryData = [
  { category: "Salud", completed: 45, missed: 5 },
  { category: "Bienestar", completed: 38, missed: 12 },
  { category: "Desarrollo", completed: 42, missed: 8 },
  { category: "Productividad", completed: 30, missed: 10 },
]

// Streak data
const streakData = [
  { habit: "Beber agua", streak: 30, best: 45 },
  { habit: "Leer", streak: 22, best: 28 },
  { habit: "Meditar", streak: 15, best: 21 },
  { habit: "Aprender idioma", streak: 12, best: 15 },
  { habit: "Cocinar sano", streak: 10, best: 14 },
]

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

  const totalCompleted = weeklyData.reduce((acc, d) => acc + d.completed, 0)
  const totalPossible = weeklyData.reduce((acc, d) => acc + d.total, 0)
  const weeklyRate = Math.round((totalCompleted / totalPossible) * 100)

  const currentTrend = monthlyTrendData[monthlyTrendData.length - 1].rate
  const previousTrend = monthlyTrendData[monthlyTrendData.length - 2].rate
  const trendDiff = currentTrend - previousTrend
  const isTrendUp = trendDiff >= 0

  return (
    <div className="flex flex-col gap-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Análisis de Progreso</h2>
          <p className="text-sm text-muted-foreground">Visualiza tu rendimiento y tendencias</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasa de Éxito
            </CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyRate}%</div>
            <div className="flex items-center gap-1 text-xs">
              {isTrendUp ? (
                <TrendingUp className="size-3 text-green-600" />
              ) : (
                <TrendingDown className="size-3 text-red-600" />
              )}
              <span className={isTrendUp ? "text-green-600" : "text-red-600"}>
                {isTrendUp ? "+" : ""}{trendDiff}%
              </span>
              <span className="text-muted-foreground">vs semana pasada</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Racha Actual
            </CardTitle>
            <Flame className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 días</div>
            <p className="text-xs text-muted-foreground">Mejor: 30 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completados
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}/{totalPossible}</div>
            <p className="text-xs text-muted-foreground">esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mejor Hábito
            </CardTitle>
            <Award className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Beber agua</div>
            <p className="text-xs text-muted-foreground">100% esta semana</p>
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
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis hide domain={[0, 5]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="completed"
                  fill="var(--color-completed)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Trend Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia Mensual</CardTitle>
            <CardDescription>Tu tasa de éxito en las últimas semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendChartConfig} className="h-[250px] w-full">
              <AreaChart data={monthlyTrendData} accessibilityLayer>
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis hide domain={[0, 100]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <defs>
                  <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-rate)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-rate)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="rate"
                  type="monotone"
                  fill="url(#fillRate)"
                  stroke="var(--color-rate)"
                  strokeWidth={2}
                />
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
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  width={100}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="completed"
                  fill="var(--color-completed)"
                  stackId="a"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="missed"
                  fill="var(--color-missed)"
                  stackId="a"
                  radius={[0, 4, 4, 0]}
                />
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
              {streakData.map((item, index) => (
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
                        style={{ width: `${(item.streak / item.best) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mejor racha: {item.best} días
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habit Performance Radial */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Individual de Hábitos</CardTitle>
          <CardDescription>Tasa de completitud por hábito este mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {habitPerformanceData.map((habit) => (
              <div key={habit.name} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <svg className="size-24" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-secondary"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={habit.fill}
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
                <span className="text-sm font-medium text-center">{habit.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <ActivityHeatmap />
    </div>
  )
}
