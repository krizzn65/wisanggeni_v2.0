"use client";

import { useState, useEffect } from 'react';
import { Thermometer, TestTube, Droplets, Bubbles, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardCharts } from "@/components/dashboard-chart";

function getStatusStyles(status: string) {
  switch (status) {
    case "baik":
      return {
        bgColor: "bg-green-100 dark:bg-green-500/20",
        textColor: "text-green-700 dark:text-green-400",
      }
    case "waspada":
      return {
        bgColor: "bg-yellow-100 dark:bg-yellow-500/20",
        textColor: "text-yellow-700 dark:text-yellow-400",
      }
    case "buruk":
      return {
        bgColor: "bg-red-100 dark:bg-red-500/20",
        textColor: "text-red-700 dark:text-red-400",
      }
    default:
      return {
        bgColor: "bg-gray-100 dark:bg-gray-500/20",
        textColor: "text-gray-700 dark:text-gray-400",
      }
  }
}

export default function DashboardPage() {
  const [latest, setLatest] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [aeratorStatus, setAeratorStatus] = useState("Aerator Off");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sensor data
  const fetchSensorData = async () => {
    try {
      const response = await fetch('/api/sensors/latest');
      const data = await response.json();
      
      if (data.success) {
        setLatest(data.data);
        setError(null);
      } else {
        setError('Failed to fetch sensor data');
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setError('Error fetching sensor data');
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch('/api/sensors/historical?limit=30');
      const data = await response.json();
      
      if (data.success) {
        setHistoricalData(data.data.reverse());
      } else {
        setError('Failed to fetch historical data');
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError('Error fetching historical data');
    }
  };

  // Fetch aerator status
  const fetchAeratorStatus = async () => {
    try {
      const autoMode = typeof window !== 'undefined' && window.localStorage 
        ? localStorage.getItem("autoMode") || "false" 
        : "false";
      
      const response = await fetch(`/api/aerator/status?autoMode=${autoMode}`, {
        cache: "no-store",
      });
      const data = await response.json();
      
      if (data.success && data.data.status) {
        setAeratorStatus(data.data.status);
      } else {
        setAeratorStatus("Aerator Off");
      }
    } catch (error) {
      console.error('Error fetching aerator status:', error);
      setAeratorStatus("Aerator Off");
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchSensorData(),
        fetchHistoricalData(),
        fetchAeratorStatus()
      ]);
      setLoading(false);
    };
    
    fetchData();
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchSensorData();
      fetchAeratorStatus();
    }, 5000);
    
    // Update historical data less frequently
    const historicalInterval = setInterval(fetchHistoricalData, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(interval);
      clearInterval(historicalInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!latest && !loading) {
    return (
      <div className="p-10 text-center text-zinc-600 dark:text-zinc-400">
        <h2 className="text-2xl font-semibold mb-2">Belum ada data sensor</h2>
        <p>
          Tambahkan data di tabel <b>sensors</b> untuk menampilkan kondisi tambak.
        </p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Suhu Air",
      value: latest?.suhu ? `${latest.suhu.toFixed(1)}°C` : "-",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
      borderColor: "border-orange-200 dark:border-orange-500/20",
      status: latest?.suhu && latest.suhu > 32 ? "buruk" : latest?.suhu && latest.suhu < 25 ? "waspada" : "baik",
    },
    {
      label: "pH Air",
      value: latest?.ph ? latest.ph.toFixed(1) : "-",
      icon: TestTube,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      borderColor: "border-blue-200 dark:border-blue-500/20",
      status:
        latest?.ph && latest.ph >= 6.5 && latest.ph <= 8
          ? "baik"
          : latest?.ph && latest.ph >= 6 && latest.ph <= 8.5
            ? "waspada"
            : "buruk",
    },
    {
      label: "Kekeruhan",
      value: latest?.kekeruhan ? `${latest.kekeruhan.toFixed(1)} NTU` : "-",
      icon: Bubbles,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
      borderColor: "border-cyan-200 dark:border-cyan-500/20",
      status:
        latest?.kekeruhan && latest.kekeruhan > 300
          ? "buruk"
          : latest?.kekeruhan && latest.kekeruhan > 200
            ? "waspada"
            : "baik",
    },
    {
      label: "Kualitas Air (Indeks)",
      value: latest?.kualitas ? latest.kualitas.toFixed(2) : "-",
      icon: Droplets,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      borderColor: "border-purple-200 dark:border-purple-500/20",
      status:
        latest?.kualitas && latest.kualitas >= 80
          ? "baik"
          : latest?.kualitas && latest.kualitas >= 60
            ? "waspada"
            : "buruk",
    },
  ];

  // Format data for charts
  const chartData = historicalData.map((data) => ({
    waktu: new Date(data.created_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    suhu: data.suhu ? Number(data.suhu.toFixed(1)) : null,
    ph: data.ph ? Number(data.ph.toFixed(1)) : null,
    kekeruhan: data.kekeruhan ? Number(data.kekeruhan.toFixed(1)) : null,
    kualitas: data.kualitas ? Number(data.kualitas.toFixed(2)) : null,
  }));

  return (
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="rounded-xl p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">
                Error
              </p>
              <p className="text-sm text-red-600 dark:text-red-400/80">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-white transition-colors">
          Dashboard
        </h1>
        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 transition-colors">
          Data terbaru dari sistem monitoring tambak.
        </p>
      </div>

      {/* Indikator Aerator */}
      <div className="rounded-xl border p-4 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Waves className="text-blue-500 w-6 h-6" />
          <p className="font-semibold text-blue-700 dark:text-blue-400 text-base">
            {aeratorStatus}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs text-blue-600 dark:text-blue-400">
            Real-time
          </span>
        </div>
      </div>

      {/* Cards Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const statusStyles = getStatusStyles(metric.status);
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
                "shadow-sm dark:shadow-none",
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300 group-hover:scale-110 border",
                    metric.bgColor,
                    metric.borderColor,
                  )}
                >
                  <Icon className={cn("size-6", metric.color)} />
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-3 py-1 rounded-full transition-colors",
                    statusStyles.bgColor,
                    statusStyles.textColor,
                  )}
                >
                  {metric.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium mb-1 text-zinc-600 dark:text-zinc-400 transition-colors">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors">{metric.value}</p>
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