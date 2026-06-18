"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

const weeklyData = [
  { day: "Lun", completed: 4, total: 5 },
  { day: "Mar", completed: 5, total: 5 },
  { day: "Mié", completed: 3, total: 5 },
  { day: "Jue", completed: 5, total: 5 },
  { day: "Vie", completed: 4, total: 5 },
  { day: "Sáb", completed: 2, total: 5 },
  { day: "Dom", completed: 3, total: 5 },
]

const chartConfig = {
  completed: {
    label: "Completados",
    color: "oklch(0.65 0.15 25)",
  },
} satisfies ChartConfig

export function WeeklyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Progreso Semanal</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
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
              content={<ChartTooltipContent hideLabel />}
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
  )
}
