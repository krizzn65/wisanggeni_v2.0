"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  HistoryIcon,
  BookOpen,
  Sliders,
  Moon,
  Sun,
} from "lucide-react"

type Item = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const items: Item[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kontrol Tambak", href: "/kontrol-tambak", icon: Sliders },
  { label: "History", href: "/history", icon: HistoryIcon },
  { label: "Panduan Smart Tambak", href: "/panduan-smart-tambak", icon: BookOpen },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme, systemTheme } = useTheme()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [activeItems, setActiveItems] = useState<{ [key: string]: boolean }>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Prevent horizontal scroll on body
    document.body.style.overflowX = 'hidden'
    document.documentElement.style.overflowX = 'hidden'
    return () => {
      document.body.style.overflowX = ''
      document.documentElement.style.overflowX = ''
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("sidebar:collapsed")
    if (saved) setCollapsed(saved === "1")
  }, [])
  
  useEffect(() => {
    localStorage.setItem("sidebar:collapsed", collapsed ? "1" : "0")
  }, [collapsed])

  useEffect(() => {
    const active = items.reduce(
      (acc, item) => {
        acc[item.href] = pathname === item.href
        return acc
      },
      {} as { [key: string]: boolean }
    )
    setActiveItems(active)
  }, [pathname])

  const widthClass = collapsed ? "w-20" : "w-72"

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted ? resolvedTheme === "dark" : false

  if (!mounted) {
    return (
      <aside
        aria-label="Sidebar Navigasi"
        className={cn(
          "fixed top-0 left-0 h-screen shrink-0 z-50",
          "transition-[width] duration-300 ease-in-out",
          widthClass
        )}
      >
        <div className="h-full border rounded-none md:rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 animate-pulse" />
      </aside>
    )
  }

  return (
    <aside
      aria-label="Sidebar Navigasi"
      className={cn(
        "fixed top-0 left-0 h-screen shrink-0 z-50",
        "transition-[width] duration-300 ease-in-out",
        widthClass
      )}
    >
      <div
        className={cn(
          "h-full flex flex-col border backdrop-blur-2xl rounded-none md:rounded-2xl shadow-2xl overflow-hidden relative",
          isDark
            ? "bg-zinc-900/95 border-zinc-800/50 shadow-black/50"
            : "bg-white/95 border-zinc-200/50 shadow-zinc-900/10"
        )}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 relative">
          <div className="flex items-center gap-2 mb-5">
            <span className="size-3 rounded-full bg-red-500 shadow-lg shadow-red-500/30" />
            <span className="size-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30" />
            <span className="size-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30" />
          </div>

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo WISANGGENI"
              className="size-8 rounded-lg object-cover"
            />
            {!collapsed && (
              <div className="min-w-0 overflow-hidden">
                <p
                  className={cn(
                    "font-semibold leading-none truncate",
                    isDark ? "text-white" : "text-zinc-900"
                  )}
                >
                  WISANGGENI
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={cn("mx-5 h-px", isDark ? "bg-zinc-800/50" : "bg-zinc-200/50")} />

        {/* Menu */}
        <nav className="px-3 py-5 overflow-y-auto flex-1 scrollbar-hide">
          {!collapsed && (
            <p
              className={cn(
                "px-3 mb-3 text-[11px] font-semibold tracking-widest uppercase",
                isDark ? "text-zinc-500" : "text-zinc-400"
              )}
            >
              MENU
            </p>
          )}
          <ul className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon
              const active = activeItems[item.href]
              return (
                <li key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-all duration-200 relative overflow-hidden",
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : isDark
                          ? "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 relative z-10 transition-all duration-300 shrink-0",
                        active
                          ? "text-white animate-pulse"
                          : "group-hover:scale-110 group-hover:rotate-12"
                      )}
                    />
                    {!collapsed && (
                      <span className="font-medium text-sm truncate relative z-10 min-w-0">
                        {item.label}
                      </span>
                    )}
                  </Link>

                  {collapsed && (
                    <div
                      className={cn(
                        "pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        "bg-blue-600 text-white text-xs font-semibold rounded-xl px-3.5 py-2 shadow-lg shadow-blue-600/30 whitespace-nowrap z-[60]"
                      )}
                    >
                      {item.label}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <div className="px-5 pb-5 pt-3">
          <div className={cn("h-px mb-3", isDark ? "bg-zinc-800/50" : "bg-zinc-200/50")} />

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
              "flex items-center gap-3.5 rounded-xl w-full px-3.5 py-3 transition-all duration-200 relative overflow-hidden group",
              isDark
                ? "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            )}
          >
            {isDark ? (
              <Sun className="size-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shrink-0" />
            ) : (
              <Moon className="size-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shrink-0" />
            )}
            {!collapsed && (
              <span className="font-medium text-sm truncate min-w-0">
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Tombol toggle di luar container */}
      <button
        onClick={() => setCollapsed((s) => !s)}
        className={cn(
          "absolute -right-4 top-1/2 -translate-y-1/2 z-50",
          "inline-flex items-center justify-center size-9 rounded-xl transition-all duration-200 border shadow-xl backdrop-blur-sm",
          isDark
            ? "bg-zinc-800/95 text-zinc-400 hover:bg-zinc-700 hover:text-white border-zinc-700/50"
            : "bg-white/95 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-zinc-300/50"
        )}
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </aside>
  )
}