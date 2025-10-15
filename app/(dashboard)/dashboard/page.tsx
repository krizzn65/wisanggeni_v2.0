import { Droplets, Thermometer, Wind, Activity } from "lucide-react";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { DashboardCharts } from "@/components/dashboard-chart";

// Refresh setiap 30 detik
export const revalidate = 30;

export default async function DashboardPage() {
  // Ambil data sensor terakhir
  const latest = await prisma.sensors.findFirst({
    orderBy: { created_at: "desc" },
  });

  // Ambil data historis (30 data terakhir)
  const historicalData = await prisma.sensors.findMany({
    orderBy: { created_at: "desc" },
    take: 30,
  });

  // Format data untuk grafik (urutkan dari lama ke baru)
  const chartData = historicalData
    .reverse()
    .map((data) => ({
      waktu: new Date(data.created_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      suhu: data.suhu ? Number(data.suhu.toFixed(1)) : null,
      ph: data.ph ? Number(data.ph.toFixed(1)) : null,
      kekeruhan: data.kekeruhan ? Number(data.kekeruhan.toFixed(1)) : null,
      kualitas: data.kualitas ? Number(data.kualitas.toFixed(2)) : null,
    }));

  if (!latest) {
    return (
      <div className="p-10 text-center text-zinc-600 dark:text-zinc-400">
        <h2 className="text-2xl font-semibold mb-2">Belum ada data sensor</h2>
        <p>
          Tambahkan data di tabel <b>sensors</b> untuk menampilkan kondisi
          tambak.
        </p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Suhu Air",
      value: latest.suhu ? `${latest.suhu.toFixed(1)}°C` : "-",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
      borderColor: "border-orange-200 dark:border-orange-500/20",
      status:
        latest.suhu && latest.suhu > 32
          ? "Tinggi"
          : latest.suhu && latest.suhu < 25
          ? "Rendah"
          : "Normal",
    },
    {
      label: "pH Air",
      value: latest.ph ? latest.ph.toFixed(1) : "-",
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      borderColor: "border-blue-200 dark:border-blue-500/20",
      status:
        latest.ph && latest.ph >= 6.5 && latest.ph <= 8
          ? "Optimal"
          : "Tidak Stabil",
    },
    {
      label: "Kekeruhan",
      value: latest.kekeruhan ? `${latest.kekeruhan.toFixed(1)} NTU` : "-",
      icon: Wind,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
      borderColor: "border-cyan-200 dark:border-cyan-500/20",
      status: latest.kekeruhan && latest.kekeruhan > 300 ? "Keruh" : "Baik",
    },
    {
      label: "Kualitas Air (Indeks)",
      value: latest.kualitas ? latest.kualitas.toFixed(2) : "-",
      icon: Activity,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      borderColor: "border-purple-200 dark:border-purple-500/20",
      status:
        latest.kualitas && latest.kualitas >= 80
          ? "Sangat Baik"
          : latest.kualitas && latest.kualitas >= 60
          ? "Baik"
          : "Buruk",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-white transition-colors">
          Dashboard
        </h1>
        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 transition-colors">
          Data terbaru dari sistem monitoring tambak.
        </p>
      </div>

      {/* Cards Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
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
                    metric.bgColor,
                    metric.borderColor
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
          );
        })}
      </div>

      {/* Grafik Historis - Client Component */}
      <DashboardCharts chartData={chartData} />
    </div>
  );
}