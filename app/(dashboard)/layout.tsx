import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex bg-background">
      <AppSidebar />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
