"use client"

import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load collapsed state from localStorage
    const saved = localStorage.getItem("sidebar:collapsed")
    if (saved) setCollapsed(saved === "1")
  }, [])

  // Listen to storage changes for sidebar state
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("sidebar:collapsed")
      if (saved) setCollapsed(saved === "1")
    }

    // Check every 100ms for changes (alternative to storage event)
    const interval = setInterval(handleStorage, 100)
    
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-dvh flex overflow-x-hidden">
        <AppSidebar />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    )
  }

  const isDark = theme === "dark"
  const marginLeft = collapsed ? "ml-20" : "ml-72"

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300 overflow-x-hidden",
        isDark ? "bg-zinc-950" : "bg-zinc-50"
      )}
    >
      {/* Sidebar tetap fixed */}
      <AppSidebar />

      {/* Konten utama digeser sesuai lebar sidebar */}
      <main
        className={cn(
          "p-6 md:p-8 transition-all duration-300 min-h-screen overflow-y-auto",
          marginLeft,
          isDark ? "text-zinc-100" : "text-zinc-900"
        )}
      >
        {children}
      </main>
    </div>
  )
}