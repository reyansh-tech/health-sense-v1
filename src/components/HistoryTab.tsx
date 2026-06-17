"use client";

import React, { useState } from "react";
import { useHealth, HistoryRecord, RiskLevel } from "@/context/HealthContext";
import { 
  History, 
  Trash2, 
  Filter, 
  Thermometer, 
  Heart, 
  Droplets, 
  Activity,
  Search,
  Calendar
} from "lucide-react";

const HistoryTab: React.FC = () => {
  const { history, deleteHistoryRecord, clearHistory } = useHealth();
  const [filter, setFilter] = useState<"All" | RiskLevel>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and search records
  const filteredHistory = history.filter((record) => {
    const matchesFilter = filter === "All" || record.riskLevel === filter;
    const matchesSearch = 
      record.healthScore.toString().includes(searchQuery) ||
      record.temperature.toString().includes(searchQuery) ||
      record.heartRate.toString().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getRiskBadgeClass = (risk: RiskLevel) => {
    switch (risk) {
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Moderate":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Health History</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Saved Smart Patch Readings</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by score, temp, or heart rate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(["All", "Low", "Moderate", "High"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                filter === type
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {type === "All" ? "All Readings" : `${type} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <History className="w-6 h-6 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm">No readings found</h3>
            <p className="text-xs text-slate-500 max-w-[200px] mx-auto">
              {history.length === 0 
                ? "Save a reading from the Dashboard to start tracking your history." 
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((record) => (
            <div 
              key={record.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden hover:border-slate-200 transition-all"
            >
              {/* Top Row: Date & Score */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">
                    {record.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })} • {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeClass(record.riskLevel)}`}>
                    {record.riskLevel} Risk
                  </span>
                  <button 
                    onClick={() => deleteHistoryRecord(record.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Row: Vitals Grid */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-50">
                {/* Health Score */}
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Score</span>
                  <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">
                    {record.healthScore}
                  </span>
                </div>
                {/* Temp */}
                <div className="text-center border-l border-slate-50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Temp</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center justify-center gap-0.5">
                    <Thermometer className="w-3 h-3 text-orange-500" />
                    {record.temperature}°C
                  </span>
                </div>
                {/* Heart Rate */}
                <div className="text-center border-l border-slate-50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Heart</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center justify-center gap-0.5">
                    <Heart className="w-3 h-3 text-rose-500" />
                    {record.heartRate}
                  </span>
                </div>
                {/* Hydration */}
                <div className="text-center border-l border-slate-50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Hydration</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 flex items-center justify-center gap-0.5">
                    <Droplets className="w-3 h-3 text-sky-500" />
                    {record.hydration}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;