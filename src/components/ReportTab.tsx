"use client";

import React from "react";
import { useHealth } from "@/context/HealthContext";
import { 
  FileText, 
  TrendingUp, 
  Heart, 
  Thermometer, 
  Droplets, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Download
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

const ReportTab: React.FC = () => {
  const { readings, history } = useHealth();

  // Calculate statistics based on history + current reading
  const allRecords = [...history, { ...readings, id: "current" }];
  const avgHealthScore = Math.round(allRecords.reduce((acc, curr) => acc + curr.healthScore, 0) / allRecords.length);
  const maxTemp = Math.max(...allRecords.map(r => r.temperature)).toFixed(1);
  const minTemp = Math.min(...allRecords.map(r => r.temperature)).toFixed(1);
  const avgHeartRate = Math.round(allRecords.reduce((acc, curr) => acc + curr.heartRate, 0) / allRecords.length);

  const handleDownloadReport = () => {
    showSuccess("PDF Health Report downloaded successfully!");
  };

  // Generate recommendations based on current state
  const getRecommendations = () => {
    const recs = [];
    if (readings.temperature >= 38.0) {
      recs.push({
        title: "Monitor Fever & Rest",
        desc: "Your temperature is elevated. Rest in a cool room and consult a doctor if it exceeds 38.5°C.",
        type: "warning"
      });
    } else {
      recs.push({
        title: "Maintain Body Temperature",
        desc: "Your body temperature is perfectly stable. Continue monitoring daily.",
        type: "success"
      });
    }

    if (readings.hydration < 50) {
      recs.push({
        title: "Increase Fluid Intake",
        desc: "Drink at least 8-10 glasses of water or electrolyte fluids to restore hydration.",
        type: "warning"
      });
    } else {
      recs.push({
        title: "Optimal Hydration",
        desc: "Excellent hydration levels. Keep drinking water consistently throughout the day.",
        type: "success"
      });
    }

    if (readings.heartRate > 100) {
      recs.push({
        title: "Reduce Physical Exertion",
        desc: "Your heart rate is elevated. Avoid strenuous activities and practice deep breathing.",
        type: "warning"
      });
    } else {
      recs.push({
        title: "Healthy Cardiovascular Activity",
        desc: "Your resting heart rate is in a healthy, stable range.",
        type: "success"
      });
    }

    recs.push({
      title: "Adequate Sleep",
      desc: "Ensure 7-8 hours of quality sleep tonight to support immune function and recovery.",
      type: "info"
    });

    return recs;
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Health Report</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">AI-Generated Diagnostic Summary</p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
          title="Download PDF Report"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Daily Summary Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Daily Summary</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg Health Score</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{avgHealthScore}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Risk Assessment</span>
            <span className={`text-sm font-bold mt-2 block ${
              readings.riskLevel === "Low" ? "text-emerald-600" : readings.riskLevel === "Moderate" ? "text-amber-600" : "text-rose-600"
            }`}>
              {readings.riskLevel} Risk
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Max Temp</span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
              <Thermometer className="w-3 h-3 text-orange-500" />
              {maxTemp}°C
            </span>
          </div>
          <div className="text-center border-x border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Min Temp</span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
              <Thermometer className="w-3 h-3 text-blue-500" />
              {minTemp}°C
            </span>
          </div>
          <div className="text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Avg Heart Rate</span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
              <Heart className="w-3 h-3 text-rose-500" />
              {avgHeartRate} BPM
            </span>
          </div>
        </div>
      </div>

      {/* Health Trend Graph */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Health Score Trend</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Last 4 Readings</span>
        </div>

        {/* Custom SVG Line Chart */}
        <div className="h-32 w-full flex items-end justify-between pt-4 relative">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
            <div className="border-b border-slate-100 w-full h-0" />
            <div className="border-b border-slate-100 w-full h-0" />
            <div className="border-b border-slate-100 w-full h-0" />
          </div>

          {/* Trend Bars / Points */}
          <div className="w-full flex justify-around items-end h-24 z-10">
            {allRecords.slice(-4).map((record, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 w-12">
                <div className="relative flex flex-col items-center group">
                  {/* Tooltip */}
                  <span className="absolute -top-7 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {record.healthScore}
                  </span>
                  {/* Bar */}
                  <div 
                    style={{ height: `${(record.healthScore / 100) * 70}px` }}
                    className={`w-3 rounded-t-full transition-all duration-500 ${
                      record.healthScore >= 90 
                        ? "bg-emerald-500" 
                        : record.healthScore >= 70 
                        ? "bg-amber-500" 
                        : "bg-rose-500"
                    }`}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-400">
                  {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Health Analysis */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Weekly Health Analysis</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Based on continuous monitoring from the HealthSense Smart Patch, your physiological parameters show a 
          <span className="font-semibold text-blue-600"> {readings.riskLevel === "Low" ? "highly stable" : "fluctuating"} </span> 
          trend. The AI engine recommends maintaining consistent hydration and monitoring body temperature fluctuations.
        </p>
      </div>

      {/* Personalized Recommendations */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 text-sm px-1">Personalized Recommendations</h3>
        <div className="space-y-2.5">
          {getRecommendations().map((rec, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border flex gap-3 items-start ${
                rec.type === "success" 
                  ? "bg-emerald-50/50 border-emerald-100" 
                  : rec.type === "warning"
                  ? "bg-amber-50/50 border-amber-100"
                  : "bg-blue-50/50 border-blue-100"
              }`}
            >
              {rec.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : rec.type === "warning" ? (
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportTab;