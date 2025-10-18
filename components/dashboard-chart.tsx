"use client";

import { Thermometer, TestTube, Droplets, Bubbles} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  waktu: string;
  suhu: number | null;
  ph: number | null;
  kekeruhan: number | null;
  kualitas: number | null;
}

interface DashboardChartsProps {
  chartData: ChartData[];
}

export function DashboardCharts({ chartData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Grafik Suhu Air */}
      <div className="rounded-2xl p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
          <Thermometer className="size-5 text-orange-500" />
          Grafik Suhu Air
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey="waktu"
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
              domain={[20, 35]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="suhu"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ fill: "#f97316", r: 3 }}
              name="Suhu (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik pH Air */}
      <div className="rounded-2xl p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
          <TestTube className="size-5 text-blue-500" />
          Grafik pH Air
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey="waktu"
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
              domain={[5, 10]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="ph"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 3 }}
              name="pH"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik Kekeruhan */}
      <div className="rounded-2xl p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
          <Bubbles className="size-5 text-cyan-500" />
          Grafik Kekeruhan
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey="waktu"
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="kekeruhan"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", r: 3 }}
              name="Kekeruhan (NTU)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik Kualitas Air */}
      <div className="rounded-2xl p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
          <Droplets className="size-5 text-purple-500" />
          Grafik Indeks Kualitas Air
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey="waktu"
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="kualitas"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: "#a855f7", r: 3 }}
              name="Indeks Kualitas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}