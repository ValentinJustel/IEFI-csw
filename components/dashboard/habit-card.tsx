"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Flame, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Habit {
  id: number
  name: string
  icon: string
  streak: number
  time: string
  completed: boolean
  category: string
}

interface HabitCardProps {
  habit: Habit
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isCompleted, setIsCompleted] = useState(habit.completed)

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border p-4 transition-all",
        isCompleted ? "bg-secondary/50 border-primary/20" : "bg-card hover:bg-secondary/30"
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-lg bg-secondary text-2xl">
        {habit.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "font-medium truncate",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {habit.name}
          </h3>
          <Badge variant="outline" className="shrink-0">
            {habit.category}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {habit.time}
          </span>
          <span className="flex items-center gap-1">
            <Flame className="size-3 text-accent" />
            {habit.streak} días
          </span>
        </div>
      </div>

      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        onClick={() => setIsCompleted(!isCompleted)}
        className="shrink-0"
      >
        {isCompleted ? (
          <>
            <CheckCircle2 data-icon="inline-start" />
            Completado
          </>
        ) : (
          <>
            <Circle data-icon="inline-start" />
            Completar
          </>
        )}
      </Button>
    </div>
  )
}
