"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Plus, Users, Trophy, MessageSquare, TrendingUp, Crown, Medal, Award, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Community {
  id: number
  name: string
  description: string
  members: number
  category: string
  icon: string
  isJoined: boolean
  activity: string
}

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  streak: number
  completionRate: number
}

const communities: Community[] = [
  { id: 1, name: "Madrugadores", description: "Comunidad para quienes quieren despertar temprano", members: 1234, category: "Productividad", icon: "☀️", isJoined: true, activity: "Muy activa" },
  { id: 2, name: "Meditadores", description: "Practicamos meditación y mindfulness juntos", members: 856, category: "Bienestar", icon: "🧘", isJoined: true, activity: "Activa" },
  { id: 3, name: "Lectores Ávidos", description: "Leemos al menos 30 minutos diarios", members: 2341, category: "Desarrollo", icon: "📚", isJoined: false, activity: "Muy activa" },
  { id: 4, name: "Runners Club", description: "Corredores de todos los niveles", members: 567, category: "Salud", icon: "🏃", isJoined: true, activity: "Activa" },
  { id: 5, name: "Dieta Saludable", description: "Compartimos recetas y consejos de nutrición", members: 1890, category: "Salud", icon: "🥗", isJoined: false, activity: "Moderada" },
  { id: 6, name: "Poliglotas", description: "Aprendemos idiomas juntos cada día", members: 432, category: "Desarrollo", icon: "🌍", isJoined: false, activity: "Activa" },
]

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Carlos M.", avatar: "/avatars/1.jpg", streak: 45, completionRate: 98 },
  { rank: 2, name: "Ana P.", avatar: "/avatars/2.jpg", streak: 38, completionRate: 95 },
  { rank: 3, name: "Miguel R.", avatar: "/avatars/3.jpg", streak: 32, completionRate: 92 },
  { rank: 4, name: "Laura S.", avatar: "/avatars/4.jpg", streak: 28, completionRate: 90 },
  { rank: 5, name: "María G.", avatar: "/avatars/5.jpg", streak: 25, completionRate: 88 },
  { rank: 6, name: "Pedro L.", avatar: "/avatars/6.jpg", streak: 22, completionRate: 85 },
  { rank: 7, name: "Sofía V.", avatar: "/avatars/7.jpg", streak: 20, completionRate: 82 },
]

const recentActivity = [
  { user: "Carlos M.", action: "completó", habit: "Meditación matutina", time: "Hace 5 min", icon: "🧘" },
  { user: "Ana P.", action: "logró racha de", habit: "30 días", time: "Hace 15 min", icon: "🔥" },
  { user: "Miguel R.", action: "se unió a", habit: "Lectores Ávidos", time: "Hace 30 min", icon: "👋" },
  { user: "Laura S.", action: "completó", habit: "Ejercicio diario", time: "Hace 1 hora", icon: "💪" },
  { user: "Pedro L.", action: "completó", habit: "Leer 30 minutos", time: "Hace 2 horas", icon: "📚" },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="size-5 text-yellow-500" />
    case 2:
      return <Medal className="size-5 text-gray-400" />
    case 3:
      return <Award className="size-5 text-amber-600" />
    default:
      return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>
  }
}

export function CommunitiesView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [communityList, setCommunityList] = useState(communities)

  const toggleJoin = (id: number) => {
    setCommunityList(communityList.map(c =>
      c.id === id ? { ...c, isJoined: !c.isJoined } : c
    ))
  }

  const joinedCommunities = communityList.filter(c => c.isJoined)
  const discoverCommunities = communityList.filter(c => !c.isJoined)

  const filteredCommunities = searchQuery
    ? communityList.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comunidades
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{joinedCommunities.length}</div>
            <p className="text-xs text-muted-foreground">activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tu Ranking
            </CardTitle>
            <Trophy className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#5</div>
            <p className="text-xs text-muted-foreground">en Madrugadores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compañeros
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,657</div>
            <p className="text-xs text-muted-foreground">en tus comunidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interacciones
            </CardTitle>
            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Create */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar comunidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus data-icon="inline-start" />
              Crear Comunidad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Comunidad</DialogTitle>
              <DialogDescription>
                Crea un espacio para conectar con personas que comparten tus hábitos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Ej: Corredores matutinos" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el propósito de tu comunidad..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoría</Label>
                <div className="flex flex-wrap gap-2">
                  {["Salud", "Bienestar", "Productividad", "Desarrollo"].map((cat) => (
                    <Badge
                      key={cat}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateOpen(false)}>
                Crear Comunidad
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Results or Main Content */}
      {filteredCommunities ? (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de búsqueda</CardTitle>
            <CardDescription>{filteredCommunities.length} comunidades encontradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onToggleJoin={() => toggleJoin(community.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Communities */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="joined">
              <TabsList>
                <TabsTrigger value="joined">Mis Comunidades ({joinedCommunities.length})</TabsTrigger>
                <TabsTrigger value="discover">Descubrir</TabsTrigger>
              </TabsList>
              <TabsContent value="joined" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {joinedCommunities.map((community) => (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      onToggleJoin={() => toggleJoin(community.id)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="discover" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {discoverCommunities.map((community) => (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      onToggleJoin={() => toggleJoin(community.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Leaderboard Semanal</CardTitle>
                  <Badge variant="secondary">Madrugadores</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {leaderboard.slice(0, 5).map((entry) => (
                    <div key={entry.rank} className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      <Avatar className="size-8">
                        <AvatarImage src={entry.avatar} alt={entry.name} />
                        <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.streak} días racha
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {entry.completionRate}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>{" "}
                          <span className="font-medium">{activity.habit}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function CommunityCard({
  community,
  onToggleJoin,
}: {
  community: Community
  onToggleJoin: () => void
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-2xl">
            {community.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{community.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {community.description}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline">{community.category}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="size-3" />
                {community.members.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Badge
            variant="secondary"
            className={cn(
              community.activity === "Muy activa" && "bg-green-100 text-green-800",
              community.activity === "Activa" && "bg-blue-100 text-blue-800",
              community.activity === "Moderada" && "bg-yellow-100 text-yellow-800"
            )}
          >
            {community.activity}
          </Badge>
          <Button
            variant={community.isJoined ? "outline" : "default"}
            size="sm"
            onClick={onToggleJoin}
          >
            {community.isJoined ? "Abandonar" : "Unirse"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
