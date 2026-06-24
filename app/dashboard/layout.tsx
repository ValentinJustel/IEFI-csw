"use client"

import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarInset, SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, Target, Bell, Users, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"

// 💎 Logo orgánico integrado para mantener la identidad visual en el dashboard
function HabitlyIcon() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg">
      <svg
        width={26}
        height={26}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200 group-hover:scale-[1.05]"
      >
        <defs>
          <linearGradient id="dashboardLogoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path
          d="M25 20C25 14.4772 29.4772 10 35 10C40.5228 10 45 14.4772 45 20V45C45 45 35 45 30 50C25 55 25 65 25 80C25 85.5228 20.5228 90 15 90C9.47715 90 5 85.5228 5 80C5 55 15 20 25 20Z"
          fill="url(#dashboardLogoGradient)"
          opacity="0.85"
        />
        <path
          d="M75 80C75 85.5228 70.5228 90 65 90C59.4772 90 55 85.5228 55 80V50C55 40 68 35 75 45C82 55 80 68 70 72C60 76 50 65 50 50V20C50 14.4772 54.4772 10 60 10C65.5228 10 70 14.4772 70 20C70 40 85 45 91 55C97 65 95 80 75 80Z"
          fill="url(#dashboardLogoGradient)"
        />
        <circle cx="50" cy="22" r="6" fill="#ec4899" />
      </svg>
    </div>
  )
}

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Mis Hábitos", href: "/dashboard/habits", icon: Target },
  { title: "Recordatorios", href: "/dashboard/reminders", icon: Bell },
  { title: "Comunidades", href: "/dashboard/communities", icon: Users },
  { title: "Seguimiento", href: "/dashboard/tracking", icon: BarChart3 },
]

const secondaryItems = [
  { title: "Configuración", href: "/dashboard/settings", icon: Settings },
]

function getInitials(name?: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="group">
                <Link href="/dashboard">
                  {/* 🚀 Logo orgánico adaptado */}
                  <HabitlyIcon />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                      Habitly
                    </span>
                    <span className="truncate text-xs text-muted-foreground">Gestión de Hábitos</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Cuenta</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="size-8">
                  <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "Usuario"} />
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name ?? "..."}</span>
                  <span className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">
              {navItems.find((i) => i.href === pathname)?.title ||
                secondaryItems.find((i) => i.href === pathname)?.title ||
                "Dashboard"}
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}