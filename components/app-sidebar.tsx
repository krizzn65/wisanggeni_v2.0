"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

import { ChevronLeft, ChevronRight, LayoutDashboard, HistoryIcon, BookOpen, Sliders, Moon, Sun } from "lucide-react"

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
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [activeItems, setActiveItems] = useState<{ [key: string]: boolean }>({})
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Persist preferensi collapse
  useEffect(() => {
    const saved = localStorage.getItem("sidebar:collapsed")
    if (saved) setCollapsed(saved === "1")
  }, [])
  
  useEffect(() => {
    localStorage.setItem("sidebar:collapsed", collapsed ? "1" : "0")
  }, [collapsed])

  // Determine active items
  useEffect(() => {
    const active = items.reduce(
      (acc, item) => {
        acc[item.href] = pathname === item.href
        return acc
      },
      {} as { [key: string]: boolean },
    )
    setActiveItems(active)
  }, [pathname])

  const widthClass = collapsed ? "w-20" : "w-72"
  const isDark = theme === "dark"

  return (
    <aside
      aria-label="Sidebar Navigasi"
      className={cn("relative h-dvh shrink-0", "transition-[width] duration-300 ease-in-out", widthClass)}
    >
      <div
        className={cn(
          "sticky top-0 h-dvh",
          "border backdrop-blur-2xl rounded-none md:rounded-2xl",
          "flex flex-col shadow-2xl",
          isDark 
            ? "bg-zinc-900/95 border-zinc-800/50 shadow-black/50" 
            : "bg-white/95 border-zinc-200/50 shadow-zinc-900/10",
          "[&_nav]:scrollbar-hide [&_nav::-webkit-scrollbar]:hidden [&_nav]:[-ms-overflow-style:none] [&_nav]:[scrollbar-width:none]",
        )}
      >
        {/* Header: brand + traffic lights */}
        <div className="px-5 pt-5 pb-4 relative">
          {/* traffic lights */}
          <div className="flex items-center gap-2 mb-5">
            <span className="size-3 rounded-full bg-red-500 shadow-lg shadow-red-500/30" aria-hidden="true" />
            <span className="size-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30" aria-hidden="true" />
            <span className="size-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30" aria-hidden="true" />
          </div>

          <div className="flex items-center gap-3">
            <div className={cn(
              "size-10 rounded-2xl grid place-items-center shadow-lg",
              isDark ? "bg-white" : "bg-zinc-900"
            )}>
              <span className={cn(
                "text-sm font-bold",
                isDark ? "text-zinc-900" : "text-white"
              )}>ST</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className={cn(
                  "font-semibold leading-none text-pretty",
                  isDark ? "text-white" : "text-zinc-900"
                )}>WISANGGENI</p>
                <p className={cn(
                  "text-xs leading-none mt-1.5",
                  isDark ? "text-zinc-400" : "text-zinc-600"
                )}>Water Integrated System and Analysis for Sustainable Aquaculture Generation</p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className={cn(
          "mx-5 h-px",
          isDark ? "bg-zinc-800/50" : "bg-zinc-200/50"
        )} />

        {/* Menu */}
        <nav className="px-3 py-5 overflow-y-auto flex-1 scrollbar-hide">
          {!collapsed && (
            <p className={cn(
              "px-3 mb-3 text-[11px] font-semibold tracking-widest uppercase",
              isDark ? "text-zinc-500" : "text-zinc-400"
            )}>MENU</p>
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
                      "flex items-center gap-3.5 rounded-xl",
                      "px-3.5 py-3 transition-all duration-200",
                      "relative overflow-hidden",
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : isDark 
                          ? "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon 
                      className={cn(
                        "size-5 relative z-10 transition-all duration-300",
                        active 
                          ? "text-white animate-pulse" 
                          : "group-hover:scale-110 group-hover:rotate-12"
                      )} 
                    />
                    {!collapsed && <span className="font-medium text-sm truncate relative z-10">{item.label}</span>}
                    
                    {/* Glow effect untuk active state */}
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 animate-pulse" />
                    )}
                  </Link>

                  {/* Tooltip balon saat collapsed */}
                  {collapsed && (
                    <div
                      role="tooltip"
                      className={cn(
                        "pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        "bg-blue-600 text-white",
                        "text-xs font-semibold rounded-xl px-3.5 py-2 shadow-lg shadow-blue-600/30",
                        "whitespace-nowrap",
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

        {/* Spacer */}
        <div className="mt-auto" />

        {/* Theme Toggle Button */}
        <div className="px-5 pb-5 pt-3">
          <div className={cn(
            "h-px mb-3",
            isDark ? "bg-zinc-800/50" : "bg-zinc-200/50"
          )} />
          
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                "flex items-center gap-3.5 rounded-xl w-full",
                "px-3.5 py-3 transition-all duration-200",
                "relative overflow-hidden group",
                isDark 
                  ? "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              )}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="size-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              ) : (
                <Moon className="size-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              )}
              {!collapsed && (
                <span className="font-medium text-sm truncate">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Toggle button di luar container - di tengah sidebar */}
      <button
        aria-label={collapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
        aria-expanded={collapsed ? "false" : "true"}
        onClick={() => setCollapsed((s) => !s)}
        className={cn(
          "absolute -right-4 top-1/2 -translate-y-1/2 z-50",
          "inline-flex items-center justify-center",
          "size-9 rounded-xl transition-all duration-200",
          "border shadow-xl backdrop-blur-sm",
          isDark
            ? "bg-zinc-800/95 text-zinc-400 hover:bg-zinc-700 hover:text-white border-zinc-700/50"
            : "bg-white/95 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-zinc-300/50",
        )}
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </aside>
  )
}