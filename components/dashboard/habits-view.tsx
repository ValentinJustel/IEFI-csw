"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Plus, Flame, Clock, Target, TrendingUp, MoreVertical, Pencil, Trash2, FolderPlus, Check, X, Palette } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Habit {
  id: number
  name: string
  description: string
  icon: string
  streak: number
  time: string
  completed: boolean
  category: string
  frequency: string
  progress: number
  goal?: string
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
}

const defaultHabits: Habit[] = [
  { id: 1, name: "Meditar", description: "Sesión de meditación guiada", icon: "🧘", streak: 15, time: "07:00", completed: true, category: "Bienestar", frequency: "Diario", progress: 100 },
  { id: 2, name: "Ejercicio", description: "Rutina de ejercicios matutina", icon: "💪", streak: 8, time: "08:00", completed: true, category: "Salud", frequency: "Diario", progress: 85 },
  { id: 3, name: "Leer 30 min", description: "Lectura de desarrollo personal", icon: "📚", streak: 22, time: "21:00", completed: false, category: "Desarrollo", frequency: "Diario", progress: 92 },
  { id: 4, name: "Beber 2L agua", description: "Mantener hidratación", icon: "💧", streak: 30, time: "Todo el día", completed: false, category: "Salud", frequency: "Diario", progress: 100 },
]

const defaultCategories: Category[] = [
  { id: "salud", name: "Salud", color: "#22c55e", icon: "💚" },
  { id: "bienestar", name: "Bienestar", color: "#8b5cf6", icon: "💜" },
  { id: "desarrollo", name: "Desarrollo", color: "#f59e0b", icon: "📖" },
  { id: "productividad", name: "Productividad", color: "#3b82f6", icon: "⚡" },
]

const iconOptions = ["🧘", "💪", "📚", "💧", "✍️", "🌍", "🧘‍♀️", "🥗", "🎯", "⏰", "🌙", "☀️", "🏃", "🎨", "🎵", "💻", "📝", "🌿", "❤️", "🧠"]
const colorOptions = ["#22c55e", "#8b5cf6", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899", "#14b8a6", "#f97316"]

export function HabitsView() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isCreateHabitOpen, setIsCreateHabitOpen] = useState(false)
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isEditHabitOpen, setIsEditHabitOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    icon: "🎯",
    category: "",
    frequency: "",
    time: "",
    goal: "",
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#3b82f6",
    icon: "📁",
  })

  const filteredHabits = selectedCategory === "Todos"
    ? habits
    : habits.filter(h => h.category === selectedCategory)

  const totalHabits = habits.length
  const completedToday = habits.filter(h => h.completed).length
  const averageStreak = totalHabits > 0 ? Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / totalHabits) : 0
  const successRate = totalHabits > 0 ? Math.round(habits.reduce((acc, h) => acc + h.progress, 0) / totalHabits) : 0

  const handleCreateHabit = () => {
    if (!newHabit.name || !newHabit.category) return
    
    const habit: Habit = {
      id: Date.now(),
      name: newHabit.name,
      description: newHabit.description,
      icon: newHabit.icon,
      category: newHabit.category,
      frequency: newHabit.frequency || "Diario",
      time: newHabit.time || "09:00",
      streak: 0,
      completed: false,
      progress: 0,
      goal: newHabit.goal,
    }
    
    setHabits([...habits, habit])
    setNewHabit({ name: "", description: "", icon: "🎯", category: "", frequency: "", time: "", goal: "" })
    setIsCreateHabitOpen(false)
  }

  const handleCreateCategory = () => {
    if (!newCategory.name) return
    
    const category: Category = {
      id: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
      name: newCategory.name,
      color: newCategory.color,
      icon: newCategory.icon,
    }
    
    setCategories([...categories, category])
    setNewCategory({ name: "", color: "#3b82f6", icon: "📁" })
    setIsCreateCategoryOpen(false)
  }

  const handleDeleteHabit = (id: number) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  const handleToggleComplete = (id: number) => {
    setHabits(habits.map(h => 
      h.id === id 
        ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : h.streak - 1 }
        : h
    ))
  }

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setIsEditHabitOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingHabit) return
    setHabits(habits.map(h => h.id === editingHabit.id ? editingHabit : h))
    setEditingHabit(null)
    setIsEditHabitOpen(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(c => c.id === categoryId)
    if (!categoryToDelete) return
    
    setCategories(categories.filter(c => c.id !== categoryId))
    setHabits(habits.map(h => 
      h.category === categoryToDelete.name ? { ...h, category: "Sin categoría" } : h
    ))
    if (selectedCategory === categoryToDelete.name) {
      setSelectedCategory("Todos")
    }
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || "#6b7280"
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Hábitos
            </CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHabits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completados Hoy
            </CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}/{totalHabits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Racha Promedio
            </CardTitle>
            <Flame className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageStreak} días</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasa de Éxito
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categorías</CardTitle>
              <CardDescription>Organiza tus hábitos por categorías personalizadas</CardDescription>
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
                  <DialogDescription>
                    Crea una categoría personalizada para organizar tus hábitos.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoryName">Nombre de la categoría</Label>
                    <Input
                      id="categoryName"
                      placeholder="Ej: Finanzas, Creatividad, Social..."
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Icono</Label>
                    <div className="flex flex-wrap gap-2">
                      {["📁", "💼", "🎨", "🏠", "💰", "🤝", "🎮", "✈️", "🍎", "💡", "🔧", "📱"].map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg border text-xl transition-colors",
                            newCategory.icon === icon
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-secondary"
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
                            newCategory.color === color
                              ? "scale-110 border-foreground"
                              : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategory({ ...newCategory, color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCategory} disabled={!newCategory.name}>
                    Crear Categoría
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
              >
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-muted-foreground">
                  ({habits.filter(h => h.category === category.name).length})
                </span>
                <button
                  type="button"
                  className="ml-1 hidden size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive hover:text-destructive-foreground group-hover:flex"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
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
                  <DialogDescription>
                    Define un nuevo hábito personalizado para incorporar a tu rutina.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del hábito</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Meditar 10 minutos"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción (opcional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe tu hábito y por qué es importante para ti..."
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
                            newHabit.icon === icon
                              ? "border-primary bg-primary/10"
                              : "border-border hover:bg-secondary"
                          )}
                          onClick={() => setNewHabit({ ...newHabit, icon })}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={newHabit.category}
                      onValueChange={(value) => setNewHabit({ ...newHabit, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              <span className="flex items-center gap-2">
                                <span
                                  className="size-2 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.icon} {category.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="frequency">Frecuencia</Label>
                      <Select
                        value={newHabit.frequency}
                        onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Diario">Diario</SelectItem>
                            <SelectItem value="Días laborales">Días laborales</SelectItem>
                            <SelectItem value="Fines de semana">Fines de semana</SelectItem>
                            <SelectItem value="3x semana">3x semana</SelectItem>
                            <SelectItem value="2x semana">2x semana</SelectItem>
                            <SelectItem value="Semanal">Semanal</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Hora preferida</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newHabit.time}
                        onChange={(e) => setNewHabit({ ...newHabit, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal">Meta (opcional)</Label>
                    <Input
                      id="goal"
                      placeholder="Ej: Completar 30 días seguidos"
                      value={newHabit.goal}
                      onChange={(e) => setNewHabit({ ...newHabit, goal: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateHabitOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateHabit} disabled={!newHabit.name || !newHabit.category}>
                    Crear Hábito
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="Todos">Todos</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.name} className="gap-1.5">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Habits Grid */}
          {filteredHabits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-medium text-lg mb-2">No hay hábitos en esta categoría</h3>
              <p className="text-muted-foreground mb-4">
                Crea tu primer hábito para comenzar tu transformación
              </p>
              <Button onClick={() => setIsCreateHabitOpen(true)}>
                <Plus data-icon="inline-start" />
                Crear Hábito
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredHabits.map((habit) => (
                <Card key={habit.id} className={cn("relative transition-all", habit.completed && "bg-secondary/30")}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-lg text-2xl transition-all",
                          habit.completed 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary hover:bg-secondary/80"
                        )}
                        onClick={() => handleToggleComplete(habit.id)}
                      >
                        {habit.completed ? <Check className="size-6" /> : habit.icon}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={cn("font-medium truncate", habit.completed && "line-through text-muted-foreground")}>
                            {habit.name}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="size-8 p-0">
                                <MoreVertical className="size-4" />
                                <span className="sr-only">Opciones</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                                  <Pencil data-icon="inline-start" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleComplete(habit.id)}>
                                  <Check data-icon="inline-start" />
                                  {habit.completed ? "Desmarcar" : "Completar"}
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteHabit(habit.id)}
                              >
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
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: getCategoryColor(habit.category), color: getCategoryColor(habit.category) }}
                          >
                            {habit.category}
                          </Badge>
                          <Badge variant="secondary">{habit.frequency}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Flame className="size-3 text-accent" />
                            {habit.streak} días
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {habit.time}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progreso mensual</span>
                            <span className="font-medium">{habit.progress}%</span>
                          </div>
                          <Progress value={habit.progress} className="h-2" />
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

      {/* Edit Habit Dialog */}
      <Dialog open={isEditHabitOpen} onOpenChange={setIsEditHabitOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Hábito</DialogTitle>
            <DialogDescription>
              Modifica los detalles de tu hábito.
            </DialogDescription>
          </DialogHeader>
          {editingHabit && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editName">Nombre del hábito</Label>
                <Input
                  id="editName"
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editDescription">Descripción</Label>
                <Textarea
                  id="editDescription"
                  value={editingHabit.description}
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
                        editingHabit.icon === icon
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-secondary"
                      )}
                      onClick={() => setEditingHabit({ ...editingHabit, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editCategory">Categoría</Label>
                <Select
                  value={editingHabit.category}
                  onValueChange={(value) => setEditingHabit({ ...editingHabit, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          <span className="flex items-center gap-2">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.icon} {category.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editFrequency">Frecuencia</Label>
                  <Select
                    value={editingHabit.frequency}
                    onValueChange={(value) => setEditingHabit({ ...editingHabit, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Diario">Diario</SelectItem>
                        <SelectItem value="Días laborales">Días laborales</SelectItem>
                        <SelectItem value="Fines de semana">Fines de semana</SelectItem>
                        <SelectItem value="3x semana">3x semana</SelectItem>
                        <SelectItem value="2x semana">2x semana</SelectItem>
                        <SelectItem value="Semanal">Semanal</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editTime">Hora preferida</Label>
                  <Input
                    id="editTime"
                    type="time"
                    value={editingHabit.time}
                    onChange={(e) => setEditingHabit({ ...editingHabit, time: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditHabitOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
