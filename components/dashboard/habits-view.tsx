"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus, Clock, Target, TrendingUp, MoreVertical,
  Pencil, Trash2, FolderPlus, Check, X, Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Habit {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  color: string
  frequency: string
  isActive: boolean
  createdAt: string
  completedToday: boolean
  tracking: { id: string; completedAt: string }[]
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const iconOptions = ["🧘", "💪", "📚", "💧", "✍️", "🌍", "🥗", "🎯", "⏰", "🌙", "☀️", "🏃", "🎨", "🎵", "💻", "📝", "🌿", "❤️", "🧠", "🔥"]
const colorOptions = ["#22c55e", "#8b5cf6", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899", "#14b8a6", "#f97316"]

// ─── Componente ──────────────────────────────────────────────────────────────

export function HabitsView() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false)
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isEditHabitOpen, setIsEditHabitOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [saving, setSaving] = useState(false)

  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    icon: "🎯",
    color: "#6366f1",
    category: "",
    frequency: "daily",
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#3b82f6",
    icon: "📁",
  })

  // ─── Fetch ────────────────────────────────────────────────────────────────

  async function fetchHabits() {
    try {
      const res = await fetch("/api/habits")
      if (!res.ok) throw new Error("Error al cargar hábitos")
      const data = await res.json()
      setHabits(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchHabits()
    fetchCategories()
  }, [])

  // ─── Crear hábito ─────────────────────────────────────────────────────────

  async function handleCreateHabit() {
    if (!newHabit.name) return
    setSaving(true)
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newHabit.name,
          description: newHabit.description || null,
          icon: newHabit.icon,
          color: newHabit.color,
          frequency: newHabit.frequency,
        }),
      })
      if (!res.ok) throw new Error("Error al crear hábito")
      const created = await res.json()
      setHabits([...habits, { ...created, completedToday: false, tracking: [] }])
      setNewHabit({ name: "", description: "", icon: "🎯", color: "#6366f1", category: "", frequency: "daily" })
      setIsCreateHabitOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // ─── Marcar/desmarcar completado ─────────────────────────────────────────

  async function handleToggleComplete(habit: Habit) {
    const method = habit.completedToday ? "DELETE" : "POST"
    setHabits(habits.map(h =>
      h.id === habit.id ? { ...h, completedToday: !h.completedToday } : h
    ))
    try {
      const res = await fetch(`/api/habits/${habit.id}/complete`, { method })
      if (!res.ok) throw new Error()
    } catch {
      setHabits(habits.map(h =>
        h.id === habit.id ? { ...h, completedToday: habit.completedToday } : h
      ))
    }
  }

  // ─── Editar hábito ────────────────────────────────────────────────────────

  async function handleSaveEdit() {
    if (!editingHabit) return
    setSaving(true)
    try {
      const res = await fetch(`/api/habits/${editingHabit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingHabit.name,
          description: editingHabit.description,
          icon: editingHabit.icon,
          color: editingHabit.color,
          frequency: editingHabit.frequency,
        }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setHabits(habits.map(h => h.id === updated.id ? { ...h, ...updated } : h))
      setIsEditHabitOpen(false)
      setEditingHabit(null)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // ─── Eliminar hábito ──────────────────────────────────────────────────────

  async function handleDeleteHabit(id: string) {
    setHabits(habits.filter(h => h.id !== id))
    try {
      await fetch(`/api/habits/${id}`, { method: "DELETE" })
    } catch (err) {
      console.error(err)
      fetchHabits()
    }
  }

  // ─── Categorías ───────────────────────────────────────────────────────────

  async function handleCreateCategory() {
    if (!newCategory.name) return
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      setCategories([...categories, created])
      setNewCategory({ name: "", color: "#3b82f6", icon: "📁" })
      setIsCreateCategoryOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    const cat = categories.find(c => c.id === categoryId)
    if (!cat) return
    setCategories(categories.filter(c => c.id !== categoryId))
    try {
      await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryId }),
      })
    } catch (err) {
      console.error(err)
      fetchCategories()
    }
    if (selectedCategory === cat.name) setSelectedCategory("Todos")
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  const totalHabits = habits.length
  const completedToday = habits.filter(h => h.completedToday).length
  const successRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hábitos</CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHabits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completados Hoy</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}/{totalHabits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Éxito Hoy</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categorías</CardTitle>
              <CardDescription>Organiza tus hábitos por categorías</CardDescription>
            </div>
            <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus data-icon="inline-start" />
                  Nueva Categoría
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Categoría</DialogTitle>
                  <DialogDescription>Crea una categoría para organizar tus hábitos.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Nombre</Label>
                    <Input
                      placeholder="Ej: Finanzas, Creatividad..."
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Icono</Label>
                    <div className="flex flex-wrap gap-2">
                      {["📁", "💼", "🎨", "🏠", "💰", "🤝", "🎮", "✈️", "🍎", "💡"].map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg border text-xl transition-colors",
                            newCategory.icon === icon ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"
                          )}
                          onClick={() => setNewCategory({ ...newCategory, icon })}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={cn(
                            "size-8 rounded-full border-2 transition-transform",
                            newCategory.color === color ? "scale-110 border-foreground" : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategory({ ...newCategory, color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateCategory} disabled={!newCategory.name}>Crear</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tenés categorías todavía. Creá una para organizar tus hábitos.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
                  <span className="size-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <button
                    type="button"
                    className="ml-1 hidden size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive hover:text-destructive-foreground group-hover:flex"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Habits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mis Hábitos</CardTitle>
              <CardDescription>Gestiona y organiza todos tus hábitos</CardDescription>
            </div>
            <Dialog open={isCreateHabitOpen} onOpenChange={setIsCreateHabitOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus data-icon="inline-start" />
                  Crear Hábito
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Hábito</DialogTitle>
                  <DialogDescription>Define un nuevo hábito para tu rutina.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Nombre del hábito *</Label>
                    <Input
                      placeholder="Ej: Meditar 10 minutos"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Descripción (opcional)</Label>
                    <Textarea
                      placeholder="¿Por qué es importante este hábito para ti?"
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Icono</Label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg border text-xl transition-colors",
                            newHabit.icon === icon ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"
                          )}
                          onClick={() => setNewHabit({ ...newHabit, icon })}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={cn(
                            "size-8 rounded-full border-2 transition-transform",
                            newHabit.color === color ? "scale-110 border-foreground" : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewHabit({ ...newHabit, color })}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Frecuencia</Label>
                    <Select
                      value={newHabit.frequency}
                      onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="daily">Diario</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateHabitOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateHabit} disabled={!newHabit.name || saving}>
                    {saving ? <Loader2 className="size-4 animate-spin" /> : "Crear Hábito"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-medium text-lg mb-2">No tenés hábitos todavía</h3>
              <p className="text-muted-foreground mb-4">Creá tu primer hábito para comenzar</p>
              <Button onClick={() => setIsCreateHabitOpen(true)}>
                <Plus data-icon="inline-start" />
                Crear Hábito
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {habits.map((habit) => (
                <Card key={habit.id} className={cn("relative transition-all", habit.completedToday && "bg-secondary/30")}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-lg text-2xl transition-all",
                          habit.completedToday
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80"
                        )}
                        style={!habit.completedToday ? { borderLeft: `3px solid ${habit.color}` } : {}}
                        onClick={() => handleToggleComplete(habit)}
                      >
                        {habit.completedToday ? <Check className="size-6" /> : (habit.icon || "🎯")}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={cn("font-medium truncate", habit.completedToday && "line-through text-muted-foreground")}>
                            {habit.name}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="size-8 p-0">
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => { setEditingHabit(habit); setIsEditHabitOpen(true) }}>
                                  <Pencil data-icon="inline-start" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleComplete(habit)}>
                                  <Check data-icon="inline-start" />
                                  {habit.completedToday ? "Desmarcar" : "Completar"}
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteHabit(habit.id)}>
                                <Trash2 data-icon="inline-start" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{habit.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{habit.frequency === "daily" ? "Diario" : habit.frequency === "weekly" ? "Semanal" : "Personalizado"}</Badge>
                          <Badge variant="outline" style={{ borderColor: habit.color, color: habit.color }}>
                            {habit.completedToday ? "✓ Completado" : "Pendiente"}
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Hoy</span>
                            <span className="font-medium">{habit.completedToday ? "100%" : "0%"}</span>
                          </div>
                          <Progress value={habit.completedToday ? 100 : 0} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditHabitOpen} onOpenChange={setIsEditHabitOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Hábito</DialogTitle>
            <DialogDescription>Modificá los detalles de tu hábito.</DialogDescription>
          </DialogHeader>
          {editingHabit && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre</Label>
                <Input
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Descripción</Label>
                <Textarea
                  value={editingHabit.description ?? ""}
                  onChange={(e) => setEditingHabit({ ...editingHabit, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label>Icono</Label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg border text-xl transition-colors",
                        editingHabit.icon === icon ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"
                      )}
                      onClick={() => setEditingHabit({ ...editingHabit, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "size-8 rounded-full border-2 transition-transform",
                        editingHabit.color === color ? "scale-110 border-foreground" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingHabit({ ...editingHabit, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Frecuencia</Label>
                <Select
                  value={editingHabit.frequency}
                  onValueChange={(value) => setEditingHabit({ ...editingHabit, frequency: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditHabitOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}