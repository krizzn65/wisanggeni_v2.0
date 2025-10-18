"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, Thermometer, Zap, Waves } from 'lucide-react';

export default function KontrolTambakPage() {
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [aerators, setAerators] = useState([
    { id: 1, name: 'Aerator 1', status: false },
    { id: 2, name: 'Aerator 2', status: false },
    { id: 3, name: 'Aerator 3', status: false },
    { id: 4, name: 'Aerator 4', status: false },
    { id: 5, name: 'Aerator 5', status: false },
    { id: 6, name: 'Aerator 6', status: false },
    { id: 7, name: 'Aerator 7', status: false },
    { id: 8, name: 'Aerator 8', status: false },
  ]);
  const [sensorData, setSensorData] = useState({
    suhu: null,
    kekeruhan: null,
    lastUpdate: null
  });
  const [loading, setLoading] = useState(true);

  // === LOAD STATUS AUTO MODE DARI LOCALSTORAGE ===
  useEffect(() => {
    const savedMode = localStorage.getItem("autoMode");
    if (savedMode === "true") {
      setIsAutoMode(true);
    }
  }, []);

  // === SIMPAN STATUS AUTO MODE SETIAP BERUBAH ===
  useEffect(() => {
    localStorage.setItem("autoMode", isAutoMode);
  }, [isAutoMode]);

  // === FETCH DATA SENSOR ===
  const fetchSensorData = async () => {
    try {
      const response = await fetch('/api/sensors/latest');
      const data = await response.json();
      
      if (data.success) {
        setSensorData({
          suhu: data.data.suhu,
          kekeruhan: data.data.kekeruhan,
          lastUpdate: new Date(data.data.updated_at)
        });
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  const isSuhuBahaya = sensorData.suhu && (sensorData.suhu > 32 || sensorData.suhu < 25);
  const isKekeruhanBahaya = sensorData.kekeruhan && sensorData.kekeruhan > 300;

  const handleAeratorToggle = async (aeratorId) => {
    if (!isAutoMode && !loading) {
      const currentAerator = aerators.find(a => a.id === aeratorId);
      const newStatus = !currentAerator.status;
      const previousAerators = [...aerators];
      
      const updatedAerators = aerators.map(aerator =>
        aerator.id === aeratorId
          ? { ...aerator, status: newStatus }
          : aerator
      );
      setAerators(updatedAerators);
      
      try {
        const response = await fetch('/api/aerator/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aeratorId, status: newStatus }),
        });
        if (!response.ok) setAerators(previousAerators);
      } catch (error) {
        setAerators(previousAerators);
        console.error('Error toggling aerator:', error);
      }
    }
  };

  const toggleAllAerators = async (status) => {
    if (!isAutoMode && !loading) {
      const previousAerators = [...aerators];
      const updatedAerators = aerators.map(aerator => ({ ...aerator, status }));
      setAerators(updatedAerators);
      
      try {
        const response = await fetch('/api/aerator/toggle-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        if (!response.ok) setAerators(previousAerators);
      } catch (error) {
        setAerators(previousAerators);
        console.error('Error toggling all aerators:', error);
      }
    }
  };

  const formatLastUpdate = (date) => {
    if (!date) return '-';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff} detik yang lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
    return date.toLocaleTimeString('id-ID');
  };

  const activeCount = aerators.filter(a => a.status).length;
  const hasWarning = isSuhuBahaya || isKekeruhanBahaya;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-zinc-900 dark:text-white transition-colors">
          Kontrol Tambak
        </h1>
        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 transition-colors">
          Atur aerator pada tambak secara manual atau otomatis
        </p>
      </div>

      {/* Peringatan Global */}
      {hasWarning && !isAutoMode && (
        <div className="rounded-xl p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">
                ⚠️ Peringatan Sistem Monitoring
              </p>
              <ul className="text-sm text-red-600 dark:text-red-400/80 space-y-1">
                {isSuhuBahaya && (
                  <li>• Suhu air {sensorData.suhu > 32 ? 'terlalu tinggi' : 'terlalu rendah'} ({sensorData.suhu}°C)</li>
                )}
                {isKekeruhanBahaya && (
                  <li>• Tingkat kekeruhan sangat tinggi ({sensorData.kekeruhan} NTU)</li>
                )}
              </ul>
              <p className="text-sm text-red-600 dark:text-red-400/80 mt-2 font-medium">
                Disarankan untuk mengaktifkan aerator segera!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Otomatis Toggle */}
      <div className="rounded-xl p-4 border bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              isAutoMode 
                ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' 
                : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50'
            }`}>
              <Zap className={`size-5 ${isAutoMode ? 'text-blue-500' : 'text-zinc-400'}`} />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Mode Aerator</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {isAutoMode ? 'Otomatis berdasarkan sensor' : 'Kontrol manual'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              const newMode = !isAutoMode;
              setIsAutoMode(newMode);

              fetch('/api/aerator/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  isAutoMode: newMode,
                  activeCount: newMode ? 8 : aerators.filter(a => a.status).length,
                }),
              });

              if (newMode) toggleAllAerators(true);
            }}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
              isAutoMode ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                isAutoMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      

      {/* Parameter Monitoring */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
            Parameter Tambak
          </h2>
          {sensorData.lastUpdate && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Update: {formatLastUpdate(sensorData.lastUpdate)}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Suhu Card */}
          <div className={`rounded-xl p-4 transition-all duration-300 border ${
            isAutoMode 
              ? 'opacity-40 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50' 
              : isSuhuBahaya 
              ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' 
              : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 hover:shadow-md'
          } shadow-sm dark:shadow-none`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg transition-all duration-300 border ${
                isAutoMode 
                  ? 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50' 
                  : isSuhuBahaya 
                  ? 'bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' 
                  : 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20'
              }`}>
                <Thermometer className={`size-5 ${
                  isAutoMode ? 'text-zinc-400' : isSuhuBahaya ? 'text-red-500' : 'text-orange-500'
                }`} />
              </div>
              {!isAutoMode && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                  isSuhuBahaya 
                    ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' 
                    : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                }`}>
                  {isSuhuBahaya ? 'Bahaya' : 'Normal'}
                </span>
              )}
            </div>
            
            <div>
              <p className={`text-xs font-medium mb-1 transition-colors ${
                isAutoMode ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-600 dark:text-zinc-400'
              }`}>
                Suhu Air
              </p>
              {loading ? (
                <p className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">Loading...</p>
              ) : (
                <p className={`text-3xl font-bold transition-colors ${
                  isAutoMode 
                    ? 'text-zinc-400 dark:text-zinc-600' 
                    : isSuhuBahaya 
                    ? 'text-red-500' 
                    : 'text-zinc-900 dark:text-white'
                }`}>
                  {isAutoMode ? '--' : sensorData.suhu ? `${sensorData.suhu}°C` : 'N/A'}
                </p>
              )}
              <p className={`text-xs mt-1 transition-colors ${
                isAutoMode ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
              }`}>
                Range normal: 25-32°C
              </p>
            </div>

            {isSuhuBahaya && !isAutoMode && (
              <div className="mt-3 p-2 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                <p className="text-xs text-red-700 dark:text-red-400">
                  Suhu {sensorData.suhu > 32 ? 'terlalu tinggi' : 'terlalu rendah'}. Aktifkan aerator!
                </p>
              </div>
            )}
          </div>

          {/* Kekeruhan Card */}
          <div className={`rounded-xl p-4 transition-all duration-300 border ${
            isAutoMode 
              ? 'opacity-40 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50' 
              : isKekeruhanBahaya 
              ? 'bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20' 
              : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 hover:shadow-md'
          } shadow-sm dark:shadow-none`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg transition-all duration-300 border ${
                isAutoMode 
                  ? 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50' 
                  : isKekeruhanBahaya 
                  ? 'bg-orange-100 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20' 
                  : 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20'
              }`}>
                <Droplets className={`size-5 ${
                  isAutoMode ? 'text-zinc-400' : isKekeruhanBahaya ? 'text-orange-500' : 'text-cyan-500'
                }`} />
              </div>
              {!isAutoMode && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                  isKekeruhanBahaya 
                    ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' 
                    : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                }`}>
                  {isKekeruhanBahaya ? 'Keruh' : 'Baik'}
                </span>
              )}
            </div>
            
            <div>
              <p className={`text-xs font-medium mb-1 transition-colors ${
                isAutoMode ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-600 dark:text-zinc-400'
              }`}>
                Kekeruhan Air
              </p>
              {loading ? (
                <p className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">Loading...</p>
              ) : (
                <p className={`text-3xl font-bold transition-colors ${
                  isAutoMode 
                    ? 'text-zinc-400 dark:text-zinc-600' 
                    : isKekeruhanBahaya 
                    ? 'text-orange-500' 
                    : 'text-zinc-900 dark:text-white'
                }`}>
                  {isAutoMode ? '--' : sensorData.kekeruhan ? `${sensorData.kekeruhan.toFixed(1)} NTU` : 'N/A'}
                </p>
              )}
              <p className={`text-xs mt-1 transition-colors ${
                isAutoMode ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
              }`}>
                Range normal: {'<'} 300 NTU
              </p>
            </div>

            {isKekeruhanBahaya && !isAutoMode && (
              <div className="mt-3 p-2 bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg">
                <p className="text-xs text-orange-700 dark:text-orange-400">
                  Kekeruhan tinggi. Aktifkan aerator untuk sirkulasi air!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kontrol Aerator Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
            Kontrol Aerator
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {activeCount}/8 Aktif
            </span>
            {!isAutoMode && (
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAllAerators(true)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 font-medium transition-colors"
                >
                  Semua ON
                </button>
                <button
                  onClick={() => toggleAllAerators(false)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 font-medium transition-colors"
                >
                  Semua OFF
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {aerators.map((aerator) => (
          <div
            key={aerator.id}
            className={`rounded-xl p-5 transition-all duration-300 border ${
              isAutoMode
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            } ${
              aerator.status
                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 shadow-md"
                : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 shadow-sm"
            } dark:shadow-none`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`p-3 rounded-xl transition-all duration-300 border ${
                  aerator.status
                    ? "bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20"
                    : "bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50"
                }`}
              >
                <Waves
                  className={`size-7 ${
                    aerator.status ? "text-green-500" : "text-zinc-400"
                  }`}
                />
              </div>

              <div className="text-center">
                <p className="text-sm font-bold text-zinc-900 dark:text-white transition-colors mb-1">
                  {aerator.name}
                </p>
                <p
                  className={`text-sm font-medium ${
                    aerator.status
                      ? "text-green-600 dark:text-green-400"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {aerator.status ? "Aktif" : "Mati"}
                </p>
              </div>

              {!isAutoMode && !loading && (
                <button
                  onClick={() => handleAeratorToggle(aerator.id)}
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 text-center ${
                    aerator.status
                      ? "bg-red-500 text-white hover:bg-red-600 active:scale-95"
                      : "bg-green-500 text-white hover:bg-green-600 active:scale-95"
                  }`}
                >
                  {aerator.status ? "Matikan" : "Aktifkan"}
                </button>
              )}

              {(isAutoMode || loading) && (
                <div className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 text-center bg-zinc-200 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600">
                  {loading ? "Loading..." : "Auto"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Info Mode Otomatis */}
      {isAutoMode && (
        <div className="rounded-xl p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
          <p className="text-xs text-blue-800 dark:text-blue-400">
            <strong className="font-bold">Mode Otomatis Aktif:</strong> Sistem akan mengatur aerator secara otomatis 
            berdasarkan pembacaan sensor suhu dan kekeruhan air tambak.
          </p>
        </div>
      )}
    </div>
  );
}