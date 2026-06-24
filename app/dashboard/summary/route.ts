// app/api/dashboard/summary/route.ts
import { NextResponse } from "next/server"

// Definimos una interfaz básica para tipar los elementos intermitentes
interface HabitItem {
  id: string
  name: string
  time: string
  streak: number
  category: string
  completed: boolean
}

export async function GET() {
  try {
    // Datos hardcodeados provisorios con tipos explícitos para que compile al 100%
    const activeHabits = 3
    const maxStreak = 12
    const maxStreakHabit = "Estudiar Portugués"
    const successRate = 85

    const habitsToday: HabitItem[] = [
      { id: "1", name: "Ir al gimnasio", time: "08:00", streak: 5, category: "Salud", completed: true },
      { id: "2", name: "Estudiar Portugués", time: "14:00", streak: 12, category: "Estudio", completed: true },
      { id: "3", name: "Programar HotelFlow", time: "18:00", streak: 3, category: "Trabajo", completed: false }
    ]

    const todayCompletedCount = habitsToday.filter((h: HabitItem) => h.completed).length
    const todayTotalCount = habitsToday.length
    const todayProgress = todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0

    const upcomingReminders = [
      { id: "1", text: "Pagar cuota Bariloche", time: "20:00" },
      { id: "2", text: "Repasar verbos en portugués", time: "22:00" }
    ]

    return NextResponse.json({
      activeHabits,
      habitsChange: "+1 este mes", 
      maxStreak,
      maxStreakHabit, 
      successRate,
      rateChange: "+4% esta semana",
      consecutiveDays: maxStreak,
      todayProgress,
      todayCompletedCount,
      todayTotalCount,
      habitsToday,
      weeklyData: [
        { day: "Lun", completed: 2 },
        { day: "Mar", completed: 3 },
        { day: "Mié", completed: todayCompletedCount },
        { day: "Jue", completed: 4 },
        { day: "Vie", completed: 5 },
        { day: "Sáb", completed: 1 },
        { day: "Dom", completed: 2 },
      ],
      upcomingReminders
    })

  } catch (error) {
    console.error("Error en /api/dashboard/summary:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}