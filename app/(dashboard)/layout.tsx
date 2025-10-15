"use client"

import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent flash of unstyled content
  if (!mounted) {
    return (
      <div className="min-h-dvh flex">
        <AppSidebar />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <div
      className={cn(
        "min-h-dvh flex transition-colors duration-300",
        isDark ? "bg-zinc-950" : "bg-zinc-50"
      )}
    >
      <AppSidebar />
      <main
        className={cn(
          "flex-1 p-6 md:p-8 transition-colors duration-300",
          isDark ? "text-zinc-100" : "text-zinc-900"
        )}
      >
        {children}
      </main>
    </div>
  )
}