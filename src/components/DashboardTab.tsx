"use client";

import React, { useState } from "react";
import { useHealth } from "@/context/HealthContext";
import { 
  Activity, 
  Thermometer, 
  Heart, 
  Droplets, 
  Sparkles, 
  RefreshCw, 
  Save, 
  FileText, 
  AlertTriangle,
  Wifi,
  WifiOff
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const DashboardTab: React.FC = () => {
  const { 
    readings, 
    connectionStatus, 
    setConnectionStatus, 
    saveCurrentReading, 
    setActiveTab, 
    triggerEmergency, 
    aiInsights 
  } = useHealth();

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showSuccess("Smart Patch data synchronized successfully!");
    }, 1000);
  };

  const toggleConnection = () => {
    if (connectionStatus === "Connected") {
      setConnectionStatus("Disconnected");
    } else {
      setConnectionStatus("Connecting");
      setTimeout(() => {
        setConnectionStatus("Connected");
        showSuccess("Smart Patch connected successfully!");
      }, 1200);
    }
  };

  // Determine color based on risk level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Moderate":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Determine color for health score gauge
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500 stroke-emerald-500";
    if (score >= 70) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  // Calculate stroke dashoffset for circular gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readings.healthScore / 100) * circumference;

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="bg-blue-600 text-white p-1 rounded-lg">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HealthSense</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Vasudha 2027 • Smart Patch Prototype</p>
        </div>

        {/* Connection Status Badge */}
        <button 
          onClick={toggleConnection}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-300 ${
            connectionStatus === "Connected" 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : connectionStatus === "Connecting"
              ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {connectionStatus === "Connected" ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Patch Connected</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </>
          ) : connectionStatus === "Connecting" ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-600" />
              <span>Patch Offline</span>
            </>
          )}
        </button>
      </div>

      {/* Circular Health Score Gauge */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleSync}
            disabled={connectionStatus !== "Connected" || isSyncing}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>

        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-slate-100"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className={`transition-all duration-1000 ease-out ${getScoreColor(readings.healthScore)}`}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Score Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold text-slate-900">{readings.healthScore}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Score</span>
          </div>
        </div>

        <div className="mt-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-slate-500">Risk Assessment:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskColor(readings.riskLevel)}`}>
              {readings.riskLevel} Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Last updated: {readings.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <Thermometer className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Body Temp</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{readings.temperature}</span>
              <span className="text-sm font-semibold text-slate-500">°C</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {readings.temperature >= 38.0 ? "Fever Detected" : "Normal Range"}
            </p>
          </div>
          {readings.temperature >= 38.0 && (
            <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-500" />
          )}
        </div>

        {/* Heart Rate Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl relative">
              <Heart className={`w-5 h-5 ${readings.heartRate > 100 ? "animate-bounce" : "animate-pulse"}`} />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heart Rate</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{readings.heartRate}</span>
              <span className="text-sm font-semibold text-slate-500">BPM</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {readings.heartRate > 100 ? "Elevated Pulse" : readings.heartRate < 60 ? "Low Pulse" : "Normal Pulse"}
            </p>
          </div>
          {readings.heartRate > 100 && (
            <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500" />
          )}
        </div>

        {/* Blood Oxygen Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SpO2</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{readings.bloodOxygen}</span>
              <span className="text-sm font-semibold text-slate-500">%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {readings.bloodOxygen < 95 ? "Low Oxygen" : "Optimal Saturation"}
            </p>
          </div>
          {readings.bloodOxygen < 95 && (
            <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500" />
          )}
        </div>

        {/* Hydration Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <Droplets className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hydration</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{readings.hydration}</span>
              <span className="text-sm font-semibold text-slate-500">%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {readings.hydration < 50 ? "Dehydrated" : "Well Hydrated"}
            </p>
          </div>
          {readings.hydration < 50 && (
            <div className="absolute top-0 right-0 w-1.5 h-full bg-sky-500" />
          )}
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 bg-blue-600 text-white rounded-lg">
            <Sparkles className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-slate-900 text-sm">AI Health Insights</h3>
        </div>
        <ul className="space-y-2">
          {aiInsights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={saveCurrentReading}
          disabled={connectionStatus !== "Connected"}
          className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-200 shadow-sm transition-all text-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-slate-600" />
          Save Reading
        </button>
        <button
          onClick={() => setActiveTab("ai-report")}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-100 transition-all text-xs"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Report
        </button>
        <button
          onClick={triggerEmergency}
          className="col-span-2 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-rose-100 transition-all text-xs"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          EMERGENCY ALERT (SOS)
        </button>
      </div>
    </div>
  );
};

export default DashboardTab;