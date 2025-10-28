"use client";

import { useState, useEffect } from 'react';
import { Calendar, Filter, Download, RefreshCw, Droplets, Thermometer, Activity, Waves, TestTube, Bubbles } from 'lucide-react';

interface SensorData {
  id: string;
  created_at: string;
  ph?: number;
  suhu?: number;
  kekeruhan?: number;
  kualitas?: number;
}

interface Filters {
  startDate: string;
  endDate: string;
  showPh: boolean;
  showSuhu: boolean;
  showKekeruhan: boolean;
  showKualitas: boolean;
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    startDate: '',
    endDate: '',
    showPh: true,
    showSuhu: true,
    showKekeruhan: true,
    showKualitas: true
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Fetch history data
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/sensors/historical?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setHistoryData(data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchHistory();
    setShowFilterPanel(false);
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      showPh: true,
      showSuhu: true,
      showKekeruhan: true,
      showKualitas: true
    });
  };

  const exportToCSV = () => {
    if (historyData.length === 0) return;

    const headers = ['Tanggal', 'Waktu'];
    if (filters.showPh) headers.push('pH');
    if (filters.showSuhu) headers.push('Suhu (°C)');
    if (filters.showKekeruhan) headers.push('Kekeruhan (NTU)');
    if (filters.showKualitas) headers.push('Kualitas Air');

    const rows = historyData.map(item => {
      const date = new Date(item.created_at);
      const row = [
        date.toLocaleDateString('id-ID'),
        date.toLocaleTimeString('id-ID')
      ];
      if (filters.showPh) row.push(item.ph?.toString() ?? '-');
      if (filters.showSuhu) row.push(item.suhu?.toString() ?? '-');
      if (filters.showKekeruhan) row.push(item.kekeruhan?.toString() ?? '-');
      if (filters.showKualitas) row.push(item.kualitas?.toString() ?? '-');
      return row;
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riwayat-sensor-${new Date().getTime()}.csv`;
    a.click();
  };

  const getStatusColor = (value: number | undefined, type: string) => {
    if (!value) return 'text-zinc-400';
    
    switch(type) {
      case 'ph':
        return value >= 6.5 && value <= 8.5 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
      case 'suhu':
        return value >= 25 && value <= 32 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
      case 'kekeruhan':
        return value < 300 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400';
      case 'kualitas':
        return value >= 70 ? 'text-green-600 dark:text-green-400' : value >= 50 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400';
      default:
        return 'text-zinc-900 dark:text-white';
    }
  };

  const activeFiltersCount = [filters.showPh, filters.showSuhu, filters.showKekeruhan, filters.showKualitas].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-white transition-colors">
          Riwayat Sensor
        </h1>
        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 transition-colors">
          Data historis sensor tambak (pH, Suhu, Kekeruhan, Kualitas Air)
        </p>
      </div>

      {/* Filter & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium text-sm"
          >
            <Filter className="size-4" />
            Filter {activeFiltersCount < 4 && `(${activeFiltersCount})`}
          </button>
          
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium text-sm disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <button
          onClick={exportToCSV}
          disabled={historyData.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="rounded-xl p-5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white">Filter Data</h3>
          
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Tanggal Mulai
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Tanggal Mulai"
                  title="Tanggal Mulai"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Tanggal Akhir
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Tanggal Akhir"
                  title="Tanggal Akhir"
                />
              </div>
            </div>
          </div>

          {/* Parameter Toggles */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Parameter yang Ditampilkan
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.showPh}
                  onChange={(e) => handleFilterChange('showPh', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <TestTube className="size-4 text-purple-500" />
                <span className="text-sm font-medium text-zinc-900 dark:text-white">pH</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.showSuhu}
                  onChange={(e) => handleFilterChange('showSuhu', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Thermometer className="size-4 text-orange-500" />
                <span className="text-sm font-medium text-zinc-900 dark:text-white">Suhu</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.showKekeruhan}
                  onChange={(e) => handleFilterChange('showKekeruhan', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Bubbles className="size-4 text-cyan-500" />
                <span className="text-sm font-medium text-zinc-900 dark:text-white">Kekeruhan</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.showKualitas}
                  onChange={(e) => handleFilterChange('showKualitas', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Droplets className="size-4 text-blue-500" />
                <span className="text-sm font-medium text-zinc-900 dark:text-white">Kualitas</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium text-sm"
            >
              Terapkan Filter
            </button>
            <button
              onClick={resetFilters}
              className="py-2 px-4 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors font-medium text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TestTube className="size-5 text-purple-500" />
            <p className="text-xs font-medium text-purple-700 dark:text-purple-400">pH</p>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
            {historyData.length > 0 && filters.showPh
              ? (historyData.reduce((acc, curr) => acc + (curr.ph || 0), 0) / historyData.filter(d => d.ph).length).toFixed(1)
              : '-'}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400/80 mt-1">Rata-rata</p>
        </div>

        <div className="rounded-xl p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="size-5 text-orange-500" />
            <p className="text-xs font-medium text-orange-700 dark:text-orange-400">Suhu</p>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">
            {historyData.length > 0 && filters.showSuhu
              ? (historyData.reduce((acc, curr) => acc + (curr.suhu || 0), 0) / historyData.filter(d => d.suhu).length).toFixed(1)
              : '-'}
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400/80 mt-1">Rata-rata °C</p>
        </div>

        <div className="rounded-xl p-4 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Bubbles className="size-5 text-cyan-500" />
            <p className="text-xs font-medium text-cyan-700 dark:text-cyan-400">Kekeruhan</p>
          </div>
          <p className="text-2xl font-bold text-cyan-900 dark:text-cyan-300">
            {historyData.length > 0 && filters.showKekeruhan
              ? (historyData.reduce((acc, curr) => acc + (curr.kekeruhan || 0), 0) / historyData.filter(d => d.kekeruhan).length).toFixed(0)
              : '-'}
          </p>
          <p className="text-xs text-cyan-600 dark:text-cyan-400/80 mt-1">Rata-rata NTU</p>
        </div>

        <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="size-5 text-blue-500" />
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Kualitas</p>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
            {historyData.length > 0 && filters.showKualitas
              ? (historyData.reduce((acc, curr) => acc + (curr.kualitas || 0), 0) / historyData.filter(d => d.kualitas).length).toFixed(0)
              : '-'}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400/80 mt-1">Rata-rata</p>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tanggal & Waktu</th>
                {filters.showPh && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">pH</th>
                )}
                {filters.showSuhu && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Suhu (°C)</th>
                )}
                {filters.showKekeruhan && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Kekeruhan (NTU)</th>
                )}
                {filters.showKualitas && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300">Kualitas Air</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    <RefreshCw className="size-6 animate-spin mx-auto mb-2" />
                    Memuat data...
                  </td>
                </tr>
              ) : historyData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Tidak ada data riwayat
                  </td>
                </tr>
              ) : (
                historyData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white font-medium">
                      {new Date(item.created_at).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    {filters.showPh && (
                      <td className={`px-4 py-3 text-sm font-semibold ${getStatusColor(item.ph, 'ph')}`}>
                        {item.ph?.toFixed(1) ?? '-'}
                      </td>
                    )}
                    {filters.showSuhu && (
                      <td className={`px-4 py-3 text-sm font-semibold ${getStatusColor(item.suhu, 'suhu')}`}>
                        {item.suhu?.toFixed(1) ?? '-'}
                      </td>
                    )}
                    {filters.showKekeruhan && (
                      <td className={`px-4 py-3 text-sm font-semibold ${getStatusColor(item.kekeruhan, 'kekeruhan')}`}>
                        {item.kekeruhan?.toFixed(0) ?? '-'}
                      </td>
                    )}
                    {filters.showKualitas && (
                      <td className={`px-4 py-3 text-sm font-semibold ${getStatusColor(item.kualitas, 'kualitas')}`}>
                        {item.kualitas?.toFixed(0) ?? '-'}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      {historyData.length > 0 && (
        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Menampilkan {historyData.length} data riwayat
        </div>
      )}
    </div>
  );
}