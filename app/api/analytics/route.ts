import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"

export async function GET(req: Request) {
  const { userId, error } = await requireAuth()
  if (error) return error

  try {
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isActive: { not: false },
      },
      include: {
        tracking: true,
      },
    })

    const totalHabitsCount = habits.length

    if (totalHabitsCount === 0) {
      return NextResponse.json({
        successRate: 0,
        currentStreak: 0,
        completedThisWeek: 0,
        totalPossibleThisWeek: 0,
        bestHabit: "Sin registros",
        weeklyData: [],
        habitPerformanceData: [],
      })
    }

    // Rango de los últimos 7 días
    const today = new Date()
    let globalCompletedCount = 0
    const totalPossibleOpportunity = totalHabitsCount * 7

    // 1. Rendimiento individual por hábito
    const habitPerformanceData = habits.map((h: any) => {
      const trackings = h.tracking || []
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const recentTrackings = trackings.filter((t: any) => new Date(t.completedAt) >= sevenDaysAgo)
      const completionCount = recentTrackings.length
      globalCompletedCount += completionCount

      return {
        name: h.name,
        value: completionCount,
        streak: h.streak || trackings.length,
      }
    })

    // 2. Tasa de éxito basada en oportunidades reales
    const successRate = totalPossibleOpportunity > 0 
      ? Math.round((globalCompletedCount / totalPossibleOpportunity) * 100) 
      : 0

    // 3. Mejor hábito
    let bestHabitName = "Ninguno"
    let maxCompletions = -1
    let globalMaxStreak = 0

    habitPerformanceData.forEach((hp: any) => {
      if (hp.value > maxCompletions) {
        maxCompletions = hp.value
        bestHabitName = hp.name
      }
      if (hp.streak > globalMaxStreak) {
        globalMaxStreak = hp.streak
      }
    })

    // 4. GENERACIÓN DEL HISTORIAL SEMANAL ORDENADO CRONOLÓGICAMENTE
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    const weeklyData = []

    // Recorremos desde hace 6 días hacia hoy paso a paso de forma ascendente
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      
      const dayLabel = daysOfWeek[d.getDay()]
      const dateStr = d.toLocaleDateString("en-CA") // YYYY-MM-DD local estricto

      let completedOnDay = 0
      habits.forEach((h: any) => {
        const hasTracking = h.tracking?.some((t: any) => {
          if (!t.completedAt) return false
          return t.completedAt.toISOString().split("T")[0] === dateStr || 
                 new Date(t.completedAt).toLocaleDateString("en-CA") === dateStr
        })
        if (hasTracking) completedOnDay++
      })

      weeklyData.push({
        day: dayLabel,
        completed: completedOnDay,
      })
    }

    return NextResponse.json({
      successRate,
      currentStreak: globalMaxStreak,
      completedThisWeek: globalCompletedCount,
      // 💎 CAMBIO CLAVE: Cambiamos totalPossibleOpportunity por totalHabitsCount si preferís ver la cantidad total de hábitos ("4" o "7") en vez de las oportunidades ("49")
      totalPossibleThisWeek: totalHabitsCount, 
      bestHabit: maxCompletions > 0 ? bestHabitName : "Sin registros",
      weeklyData,
      habitPerformanceData,
    })

  } catch (err) {
    console.error("Error en GET /api/analytics:", err)
    return NextResponse.json({ error: "Error al calcular analíticas" }, { status: 500 })
  }
}