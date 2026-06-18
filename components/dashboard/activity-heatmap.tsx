"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Generate mock data for the last 12 weeks
function generateHeatmapData() {
  const data: { date: Date; value: number }[] = []
  const today = new Date()
  
  for (let i = 83; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date,
      value: Math.floor(Math.random() * 5),
    })
  }
  
  return data
}

const heatmapData = generateHeatmapData()

const getIntensityClass = (value: number) => {
  switch (value) {
    case 0:
      return "bg-secondary"
    case 1:
      return "bg-accent/20"
    case 2:
      return "bg-accent/40"
    case 3:
      return "bg-accent/60"
    case 4:
      return "bg-accent/80"
    default:
      return "bg-secondary"
  }
}

const weekDays = ["L", "M", "X", "J", "V", "S", "D"]

export function ActivityHeatmap() {
  // Group data by weeks
  const weeks: { date: Date; value: number }[][] = []
  let currentWeek: { date: Date; value: number }[] = []
  
  heatmapData.forEach((day, index) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad de los Últimos 3 Meses</CardTitle>
        <CardDescription>
          Tu consistencia diaria en completar hábitos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pt-6">
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex h-3 items-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={cn(
                        "size-3 rounded-sm transition-colors hover:ring-1 hover:ring-foreground/20",
                        getIntensityClass(day.value)
                      )}
                      title={`${day.date.toLocaleDateString("es-ES")}: ${day.value} hábitos`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((value) => (
              <div
                key={value}
                className={cn("size-3 rounded-sm", getIntensityClass(value))}
              />
            ))}
          </div>
          <span>Más</span>
        </div>
      </CardContent>
    </Card>
  )
}
