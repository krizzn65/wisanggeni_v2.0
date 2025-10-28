"use client";

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Droplets, Thermometer, Zap, Waves, Info, Bubbles} from 'lucide-react';

// Default aerator states
const defaultAerators = [
  { id: 1, name: 'Aerator 1', status: false },
  { id: 2, name: 'Aerator 2', status: false },
  { id: 3, name: 'Aerator 3', status: false },
  { id: 4, name: 'Aerator 4', status: false },
  { id: 5, name: 'Aerator 5', status: false },
  { id: 6, name: 'Aerator 6', status: false },
  { id: 7, name: 'Aerator 7', status: false },
  { id: 8, name: 'Aerator 8', status: false },
];

// Helper function to get status styles
function getStatusStyles(status: string) {
  switch (status) {
    case "baik":
      return {
        bgColor: "bg-green-100 dark:bg-green-500/20",
        textColor: "text-green-700 dark:text-green-400",
        iconBgColor: "bg-green-100 dark:bg-green-500/10",
        iconBorderColor: "border-green-200 dark:border-green-500/20",
        iconColor: "text-green-500",
        cardBgColor: "bg-green-50 dark:bg-green-500/5",
        cardBorderColor: "border-green-200 dark:border-green-500/20",
      }
    case "waspada":
      return {
        bgColor: "bg-yellow-100 dark:bg-yellow-500/20",
        textColor: "text-yellow-700 dark:text-yellow-400",
        iconBgColor: "bg-yellow-100 dark:bg-yellow-500/10",
        iconBorderColor: "border-yellow-200 dark:border-yellow-500/20",
        iconColor: "text-yellow-500",
        cardBgColor: "bg-yellow-50 dark:bg-yellow-500/5",
        cardBorderColor: "border-yellow-200 dark:border-yellow-500/20",
      }
    case "buruk":
      return {
        bgColor: "bg-red-100 dark:bg-red-500/20",
        textColor: "text-red-700 dark:text-red-400",
        iconBgColor: "bg-red-100 dark:bg-red-500/10",
        iconBorderColor: "border-red-200 dark:border-red-500/20",
        iconColor: "text-red-500",
        cardBgColor: "bg-red-50 dark:bg-red-500/5",
        cardBorderColor: "border-red-200 dark:border-red-500/20",
      }
    default:
      return {
        bgColor: "bg-gray-100 dark:bg-gray-500/20",
        textColor: "text-gray-700 dark:text-gray-400",
        iconBgColor: "bg-gray-100 dark:bg-gray-500/10",
        iconBorderColor: "border-gray-200 dark:border-gray-500/20",
        iconColor: "text-gray-500",
        cardBgColor: "bg-white dark:bg-zinc-900/50",
        cardBorderColor: "border-zinc-200 dark:border-zinc-800/50",
      }
  }
}

// Helper function to determine temperature status
function getTemperatureStatus(suhu: number | null) {
  if (!suhu) return null;
  if (suhu >= 25 && suhu <= 32) return "baik";
  if ((suhu < 25 && suhu >= 20) || (suhu > 32 && suhu <= 35)) return "waspada";
  return "buruk";
}

// Helper function to determine turbidity status
function getTurbidityStatus(kekeruhan: number | null) {
  if (!kekeruhan) return null;
  if (kekeruhan >= 20 && kekeruhan <= 50) return "baik";
  if (kekeruhan < 20 || (kekeruhan > 50 && kekeruhan <= 60)) return "waspada";
  return "buruk";
}

export default function KontrolTambakPage() {
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [aerators, setAerators] = useState(defaultAerators);
  const [sensorData, setSensorData] = useState({
    suhu: null,
    kekeruhan: null,
    lastUpdate: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [autoActivated, setAutoActivated] = useState(false);
  const [autoActivationReason, setAutoActivationReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoModeInitialized, setAutoModeInitialized] = useState(false);
  const [restoringState, setRestoringState] = useState(false);
  const [aeratorStatus, setAeratorStatus] = useState("Aerator Off");
  const autoModeRef = useRef(false);
  const aeratorsRef = useRef(defaultAerators);
  const lastAutoCheckRef = useRef({});

  // Update refs when state changes
  useEffect(() => {
    autoModeRef.current = isAutoMode;
  }, [isAutoMode]);

  useEffect(() => {
    aeratorsRef.current = aerators;
  }, [aerators]);

  // === LOAD AERATOR STATES FROM SERVER ===
  const loadAeratorStates = async () => {
    try {
      const response = await fetch('/api/aerator/status');
      const data = await response.json();
      
      if (data.success && data.data.aerators) {
        // Check if we're in auto mode and need to override server state
        const savedAutoMode = localStorage.getItem("autoMode");
        const savedAutoActivated = localStorage.getItem("autoActivated");
        
        if (savedAutoMode === "true" && savedAutoActivated !== "true") {
          // We're in auto mode but not auto-activated, ensure all aerators are off
          const correctedStates = data.data.aerators.map((aerator: any) => ({
            ...aerator,
            status: false
          }));
          setAerators(correctedStates);
          localStorage.setItem('aeratorStates', JSON.stringify(correctedStates));
        } else {
          setAerators(data.data.aerators);
          localStorage.setItem('aeratorStates', JSON.stringify(data.data.aerators));
        }
        
        // Update aerator status indicator
        if (data.data.status) {
          setAeratorStatus(data.data.status);
        }
      }
    } catch (error) {
      console.error('Error loading aerator states:', error);
      // Try to load from localStorage as fallback
      try {
        const savedStates = localStorage.getItem('aeratorStates');
        if (savedStates) {
          setAerators(JSON.parse(savedStates));
        }
      } catch (localStorageError) {
        console.error('Error loading from localStorage:', localStorageError);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  // === SAVE AERATOR STATES TO LOCALSTORAGE ===
  const saveAeratorStates = (states) => {
    try {
      localStorage.setItem('aeratorStates', JSON.stringify(states));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // === LOAD AUTO MODE STATES FROM LOCALSTORAGE ===
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("autoMode");
      if (savedMode === "true") {
        setIsAutoMode(true);
        
        // Load auto activation state
        const savedAutoActivated = localStorage.getItem("autoActivated");
        const savedAutoReason = localStorage.getItem("autoActivationReason");
        
        if (savedAutoActivated === "true") {
          setAutoActivated(true);
          setAutoActivationReason(savedAutoReason || "");
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, []);

  // === SAVE AUTO MODE STATES TO LOCALSTORAGE ===
  useEffect(() => {
    try {
      localStorage.setItem("autoMode", isAutoMode);
      localStorage.setItem("autoActivated", autoActivated.toString());
      localStorage.setItem("autoActivationReason", autoActivationReason);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [isAutoMode, autoActivated, autoActivationReason]);

  // === INITIAL LOAD ===
  useEffect(() => {
    loadAeratorStates();
  }, []);

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
        setError(null);
      } else {
        setError('Failed to fetch sensor data');
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setError('Error fetching sensor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoading) {
      fetchSensorData();
      const interval = setInterval(fetchSensorData, 5000);
      return () => clearInterval(interval);
    }
  }, [initialLoading]);

  // === UPDATE AERATOR STATUS INDICATOR ===
  useEffect(() => {
    const activeCount = aerators.filter(a => a.status).length;
    
    if (isAutoMode) {
      if (activeCount > 0) {
        setAeratorStatus("Aerator Mode otomatis (Aerator On)");
      } else {
        setAeratorStatus("Aerator Mode otomatis (Aerator Off)");
      }
    } else {
      if (activeCount > 0) {
        setAeratorStatus(`Aerator On ${activeCount}/8`);
      } else {
        setAeratorStatus("Aerator Off");
      }
    }
  }, [isAutoMode, aerators]);

  // === RESTORE AUTO MODE STATE ===
  useEffect(() => {
    if (isAutoMode && !initialLoading && !autoModeInitialized && !restoringState) {
      setRestoringState(true);
      console.log('Restoring auto mode state - ensuring aerators are off');
      
      // When auto mode is on and we're initializing, ensure all aerators are off
      const anyOn = aerators.some(a => a.status);
      if (anyOn) {
        const updatedAerators = aerators.map(aerator => ({ ...aerator, status: false }));
        setAerators(updatedAerators);
        saveAeratorStates(updatedAerators);
        
        // Sync with server
        fetch('/api/aerator/toggle-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: false }),
        }).catch(error => {
          console.error('Error syncing with server:', error);
        });
      }
      
      setAutoModeInitialized(true);
      setRestoringState(false);
    }
  }, [isAutoMode, initialLoading, autoModeInitialized, restoringState, aerators]);

  // === AUTO MODE LOGIC ===
  useEffect(() => {
    // Skip if not in auto mode, still loading, processing, or restoring
    if (!isAutoMode || initialLoading || loading || isProcessing || restoringState) return;

    const suhuStatus = getTemperatureStatus(sensorData.suhu);
    const kekeruhanStatus = getTurbidityStatus(sensorData.kekeruhan);
    
    // Check if either parameter is "buruk"
    const hasBadParameter = suhuStatus === "buruk" || kekeruhanStatus === "buruk";
    
    // Create a key for the current state to avoid unnecessary re-runs
    const currentStateKey = `${suhuStatus}-${kekeruhanStatus}-${autoActivated}`;
    
    // Skip if state hasn't changed
    if (lastAutoCheckRef.current.key === currentStateKey) return;
    
    console.log('Auto mode check:', {
      suhuStatus,
      kekeruhanStatus,
      hasBadParameter,
      autoActivated,
      anyOn: aerators.some(a => a.status),
      autoModeInitialized,
      sensorData: {
        suhu: sensorData.suhu,
        kekeruhan: sensorData.kekeruhan
      }
    });

    if (hasBadParameter) {
      // Always turn on all aerators if any parameter is "buruk"
      console.log('Auto activating aerators due to bad parameters');
      setAutoActivated(true);
      
      // Set the reason for activation
      if (suhuStatus === "buruk" && kekeruhanStatus === "buruk") {
        setAutoActivationReason("suhu dan kekeruhan air");
      } else if (suhuStatus === "buruk") {
        setAutoActivationReason("suhu air");
      } else {
        setAutoActivationReason("kekeruhan air");
      }
      
      // Turn on all aerators
      const updatedAerators = aerators.map(aerator => ({ ...aerator, status: true }));
      setAerators(updatedAerators);
      saveAeratorStates(updatedAerators);
      
      // Sync with server
      fetch('/api/aerator/toggle-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: true }),
      }).catch(error => {
        console.error('Error syncing with server:', error);
      });
    } else {
      // Turn off all aerators if they were auto-activated and parameters are now normal
      const anyOn = aerators.some(a => a.status);
      if (anyOn && autoActivated) {
        console.log('Auto deactivating aerators - parameters back to normal');
        setAutoActivated(false);
        setAutoActivationReason("");
        
        // Turn off all aerators
        const updatedAerators = aerators.map(aerator => ({ ...aerator, status: false }));
        setAerators(updatedAerators);
        saveAeratorStates(updatedAerators);
        
        // Sync with server
        fetch('/api/aerator/toggle-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: false }),
        }).catch(error => {
          console.error('Error syncing with server:', error);
        });
      }
    }
    
    // Update last check state
    lastAutoCheckRef.current = {
      key: currentStateKey,
      timestamp: Date.now()
    };
  }, [isAutoMode, sensorData, initialLoading, loading, isProcessing, aerators, autoActivated, autoModeInitialized, restoringState]);

  // Get status for temperature and turbidity
  const suhuStatus = getTemperatureStatus(sensorData.suhu);
  const kekeruhanStatus = getTurbidityStatus(sensorData.kekeruhan);
  const suhuStyles = getStatusStyles(suhuStatus || "");
  const kekeruhanStyles = getStatusStyles(kekeruhanStatus || "");
  
  // Check if there's any warning
  const hasWarning = suhuStatus === "buruk" || kekeruhanStatus === "buruk" || 
                    suhuStatus === "waspada" || kekeruhanStatus === "waspada";

  const handleAeratorToggle = async (aeratorId) => {
    // Prevent manual control in auto mode
    if (isAutoMode || loading || initialLoading || isProcessing) return;

    setIsProcessing(true);
    const currentAerator = aerators.find(a => a.id === aeratorId);
    const newStatus = !currentAerator.status;
    const previousAerators = [...aerators];
    
    // Optimistic update
    const updatedAerators = aerators.map(aerator =>
      aerator.id === aeratorId
        ? { ...aerator, status: newStatus }
        : aerator
    );
    setAerators(updatedAerators);
    saveAeratorStates(updatedAerators);
    
    try {
      console.log('Sending API request', { aeratorId, status: newStatus });
      const response = await fetch('/api/aerator/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aeratorId, status: newStatus }),
      });
      
      const data = await response.json();
      console.log('API response', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'API request failed');
      }
      
      // Update with server response (in case there are changes)
      if (data.data.allStates) {
        setAerators(data.data.allStates);
        saveAeratorStates(data.data.allStates);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error toggling aerator:', error);
      setError(`Failed to toggle aerator: ${error.message}`);
      // Revert the optimistic update
      setAerators(previousAerators);
      saveAeratorStates(previousAerators);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAllAerators = async (status) => {
    // Prevent manual control in auto mode
    if (isAutoMode || loading || initialLoading || isProcessing) return;

    setIsProcessing(true);
    const previousAerators = [...aerators];
    const updatedAerators = aerators.map(aerator => ({ ...aerator, status }));
    setAerators(updatedAerators);
    saveAeratorStates(updatedAerators);
    
    try {
      console.log('Sending toggle all request', { status });
      const response = await fetch('/api/aerator/toggle-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      const data = await response.json();
      console.log('Toggle all response', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'API request failed');
      }
      
      // Update with server response
      if (data.data.allStates) {
        setAerators(data.data.allStates);
        saveAeratorStates(data.data.allStates);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error toggling all aerators:', error);
      setError(`Failed to toggle all aerators: ${error.message}`);
      setAerators(previousAerators);
      saveAeratorStates(previousAerators);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoModeToggle = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    const newMode = !isAutoMode;
    
    try {
      // Update UI immediately
      setIsAutoMode(newMode);
      setAutoModeInitialized(false); // Reset initialization flag
      setRestoringState(false); // Reset restoring state flag
      
      // Reset auto activation state
      setAutoActivated(false);
      setAutoActivationReason("");
      
      // When auto mode is turned on, turn off all aerators
      if (newMode) {
        console.log('Auto mode activated - turning off all aerators');
        const updatedAerators = aerators.map(aerator => ({ ...aerator, status: false }));
        setAerators(updatedAerators);
        saveAeratorStates(updatedAerators);
        
        // Sync with server
        const response = await fetch('/api/aerator/toggle-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: false }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update aerator states');
        }
      }
      
      // Update server with mode change
      const modeResponse = await fetch('/api/aerator/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isAutoMode: newMode,
          activeCount: 0,
        }),
      });

      const modeData = await modeResponse.json();
      if (!modeResponse.ok || !modeData.success) {
        throw new Error(modeData.message || 'Failed to update mode');
      }

      setError(null);
    } catch (error) {
      console.error('Error updating auto mode:', error);
      setError(`Failed to update mode: ${error.message}`);
      // Revert the mode change
      setIsAutoMode(!newMode);
    } finally {
      setIsProcessing(false);
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

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Loading aerator states...</p>
        </div>
      </div>
    );
  }

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

      {/* Aerator Status Indicator */}
      <div className="rounded-xl border p-4 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Waves className="text-blue-500 w-6 h-6" />
          <p className="font-semibold text-blue-700 dark:text-blue-400 text-base">
            {aeratorStatus}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Info className="text-blue-500 w-4 h-4" />
          <span className="text-xs text-blue-600 dark:text-blue-400">
            Status sinkron dengan dashboard
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-xl p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
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

      {/* Auto Activation Warning */}
      {isAutoMode && autoActivated && (
        <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-1">
                ⚠️ Mode Otomatis Aktif
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400/80">
                Semua aerator telah diaktifkan secara otomatis karena {autoActivationReason} dalam kondisi "buruk".
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auto Mode Status */}
      {isAutoMode && !autoActivated && (
        <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-500/20 shadow-sm">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-400 mb-1">
                Mode Otomatis Aktif
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400/80">
                Semua aerator dalam kondisi mati. Aerator akan aktif secara otomatis jika ada parameter yang mencapai status "buruk".
              </p>
            </div>
          </div>
        </div>
      )}

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
                {suhuStatus === "buruk" && (
                  <li>• Suhu air {sensorData.suhu > 35 ? 'sangat tinggi' : sensorData.suhu < 20 ? 'sangat rendah' : 'tidak normal'} ({sensorData.suhu}°C)</li>
                )}
                {suhuStatus === "waspada" && (
                  <li>• Suhu air {sensorData.suhu > 32 ? 'tinggi' : 'rendah'} ({sensorData.suhu}°C)</li>
                )}
                {kekeruhanStatus === "buruk" && (
                  <li>• Tingkat kekeruhan sangat tinggi ({sensorData.kekeruhan} NTU)</li>
                )}
                {kekeruhanStatus === "waspada" && (
                  <li>• Tingkat kekeruhan tinggi ({sensorData.kekeruhan} NTU)</li>
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
            onClick={handleAutoModeToggle}
            disabled={isProcessing}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
              isAutoMode ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          {/* Suhu Card - Always active */}
          <div className={`rounded-xl p-4 transition-all duration-300 border hover:shadow-md ${
            suhuStyles.cardBgColor + " " + suhuStyles.cardBorderColor
          } shadow-sm dark:shadow-none`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg transition-all duration-300 border ${
                suhuStyles.iconBgColor + " " + suhuStyles.iconBorderColor
              }`}>
                <Thermometer className={`size-5 ${suhuStyles.iconColor}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                suhuStyles.bgColor + " " + suhuStyles.textColor
              }`}>
                {suhuStatus === "baik" ? "Baik" : suhuStatus === "waspada" ? "Waspada" : "Buruk"}
              </span>
            </div>
            
            <div>
              <p className="text-xs font-medium mb-1 text-zinc-600 dark:text-zinc-400 transition-colors">
                Suhu Air
              </p>
              {loading ? (
                <p className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">Loading...</p>
              ) : (
                <p className={`text-3xl font-bold transition-colors ${
                  suhuStatus === "baik" 
                    ? "text-green-500" 
                    : suhuStatus === "waspada"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                  {sensorData.suhu ? `${sensorData.suhu}°C` : 'N/A'}
                </p>
              )}
              <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                Range normal: 25-32°C
              </p>
            </div>

            {suhuStatus && suhuStatus !== "baik" && (
              <div className={`mt-3 p-2 rounded-lg ${
                suhuStatus === "buruk" 
                  ? "bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20" 
                  : "bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20"
              }`}>
                <p className={`text-xs ${
                  suhuStatus === "buruk" 
                    ? "text-red-700 dark:text-red-400" 
                    : "text-yellow-700 dark:text-yellow-400"
                }`}>
                  {suhuStatus === "buruk" 
                    ? `Suhu ${sensorData.suhu > 35 ? 'sangat tinggi' : sensorData.suhu < 20 ? 'sangat rendah' : 'tidak normal'}. ${isAutoMode ? 'Aerator akan aktif otomatis.' : 'Segera periksa kondisi tambak!'}`
                    : `Suhu ${sensorData.suhu > 32 ? 'tinggi' : 'rendah'}. ${isAutoMode ? 'Monitor kondisi dengan seksama.' : 'Pertimbangkan untuk mengaktifkan aerator.'}`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Kekeruhan Card - Always active */}
          <div className={`rounded-xl p-4 transition-all duration-300 border hover:shadow-md ${
            kekeruhanStyles.cardBgColor + " " + kekeruhanStyles.cardBorderColor
          } shadow-sm dark:shadow-none`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg transition-all duration-300 border ${
                kekeruhanStyles.iconBgColor + " " + kekeruhanStyles.iconBorderColor
              }`}>
                <Bubbles className={`size-5 ${kekeruhanStyles.iconColor}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                kekeruhanStyles.bgColor + " " + kekeruhanStyles.textColor
              }`}>
                {kekeruhanStatus === "baik" ? "Baik" : kekeruhanStatus === "waspada" ? "Waspada" : "Buruk"}
              </span>
            </div>
            
            <div>
              <p className="text-xs font-medium mb-1 text-zinc-600 dark:text-zinc-400 transition-colors">
                Kekeruhan Air
              </p>
              {loading ? (
                <p className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">Loading...</p>
              ) : (
                <p className={`text-3xl font-bold transition-colors ${
                  kekeruhanStatus === "baik" 
                    ? "text-cyan-500" 
                    : kekeruhanStatus === "waspada"
                    ? "text-yellow-500"
                    : "text-orange-500"
                }`}>
                  {sensorData.kekeruhan ? `${sensorData.kekeruhan.toFixed(1)} NTU` : 'N/A'}
                </p>
              )}
              <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                Range normal: 20-50 NTU
              </p>
            </div>

            {kekeruhanStatus && kekeruhanStatus !== "baik" && (
              <div className={`mt-3 p-2 rounded-lg ${
                kekeruhanStatus === "buruk" 
                  ? "bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20" 
                  : "bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20"
              }`}>
                <p className={`text-xs ${
                  kekeruhanStatus === "buruk" 
                    ? "text-orange-700 dark:text-orange-400" 
                    : "text-yellow-700 dark:text-yellow-400"
                }`}>
                  {kekeruhanStatus === "buruk" 
                    ? `Kekeruhan sangat tinggi. ${isAutoMode ? 'Aerator akan aktif otomatis.' : 'Segera aktifkan aerator untuk sirkulasi air!'}`
                    : `Kekeruhan tinggi. ${isAutoMode ? 'Monitor kondisi dengan seksama.' : 'Pertimbangkan untuk mengaktifkan aerator.'}`
                  }
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
                  disabled={isProcessing}
                  className="text-xs px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Semua ON
                </button>
                <button
                  onClick={() => toggleAllAerators(false)}
                  disabled={isProcessing}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                {!isAutoMode && !loading && !initialLoading && (
                  <button
                    onClick={() => handleAeratorToggle(aerator.id)}
                    disabled={isProcessing}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 text-center ${
                      aerator.status
                        ? "bg-red-500 text-white hover:bg-red-600 active:scale-95"
                        : "bg-green-500 text-white hover:bg-green-600 active:scale-95"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {aerator.status ? "Matikan" : "Aktifkan"}
                  </button>
                )}

                {(isAutoMode || loading || initialLoading) && (
                  <div className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 text-center bg-zinc-200 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600">
                    {initialLoading ? "Loading..." : loading ? "Updating..." : "Auto"}
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
            berdasarkan pembacaan sensor suhu dan kekeruhan air tambak. Aerator akan mati saat mode otomatis diaktifkan 
            dan hanya akan hidup jika salah satu parameter menunjukkan status "buruk". Parameter monitoring tetap aktif 
            untuk memantau kondisi air.
          </p>
        </div>
      )}
    </div>
  );
}