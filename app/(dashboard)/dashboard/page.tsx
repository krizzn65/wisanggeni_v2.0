import { Droplets, Thermometer, Wind, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const metrics = [
    {
      label: "Suhu Air",
      value: "28.5°C",
      icon: Thermometer,
      color: "text-orange-500",
      bgColorLight: "bg-orange-50",
      bgColorDark: "bg-orange-500/10",
      borderColorLight: "border-orange-200",
      borderColorDark: "border-orange-500/20",
      status: "Normal",
    },
    {
      label: "pH Air",
      value: "7.2",
      icon: Droplets,
      color: "text-blue-500",
      bgColorLight: "bg-blue-50",
      bgColorDark: "bg-blue-500/10",
      borderColorLight: "border-blue-200",
      borderColorDark: "border-blue-500/20",
      status: "Optimal",
    },
    {
      label: "Oksigen Terlarut",
      value: "6.8 mg/L",
      icon: Wind,
      color: "text-cyan-500",
      bgColorLight: "bg-cyan-50",
      bgColorDark: "bg-cyan-500/10",
      borderColorLight: "border-cyan-200",
      borderColorDark: "border-cyan-500/20",
      status: "Baik",
    },
    {
      label: "Salinitas",
      value: "15 ppt",
      icon: Activity,
      color: "text-purple-500",
      bgColorLight: "bg-purple-50",
      bgColorDark: "bg-purple-500/10",
      borderColorLight: "border-purple-200",
      borderColorDark: "border-purple-500/20",
      status: "Stabil",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-white transition-colors">
          Dashboard
        </h1>
        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 transition-colors">
          Ringkasan kondisi tambak, metrik utama, dan status terbaru.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div
              key={index}
              className={cn(
                "rounded-2xl p-6 transition-all duration-300 border group",
                "bg-white dark:bg-zinc-900/50",
                "border-zinc-200 dark:border-zinc-800/50",
                "hover:scale-105 hover:shadow-xl",
                "hover:bg-zinc-50 dark:hover:bg-zinc-900/80",
                "hover:border-zinc-300 dark:hover:border-zinc-700",
                "shadow-sm dark:shadow-none"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300 group-hover:scale-110 border",
                    metric.bgColorLight,
                    `dark:${metric.bgColorDark}`,
                    metric.borderColorLight,
                    `dark:${metric.borderColorDark}`
                  )}
                >
                  <Icon className={cn("size-6", metric.color)} />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 transition-colors">
                  {metric.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-400 transition-colors">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors">
                  {metric.value}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <div className="rounded-2xl p-6 border transition-all duration-300 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white transition-colors">
            Aktivitas Terkini
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 transition-colors"
              >
                <div className="size-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-500/20 transition-colors">
                  <Activity className="size-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 dark:text-white transition-colors">
                    Pemantauan #{item}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 transition-colors">
                    {item} menit yang lalu
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl p-6 border transition-all duration-300 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
          <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white transition-colors">
            Status Sistem
          </h2>
          <div className="space-y-4">
            {[
              { label: "Sensor Suhu", status: "Aktif", color: "green" },
              { label: "Sensor pH", status: "Aktif", color: "green" },
              { label: "Pompa Air", status: "Berjalan", color: "blue" },
            ].map((system, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 transition-colors"
              >
                <span className="font-medium text-zinc-900 dark:text-white transition-colors">
                  {system.label}
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold px-3 py-1 rounded-full transition-colors",
                    system.color === "green"
                      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                  )}
                >
                  {system.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}