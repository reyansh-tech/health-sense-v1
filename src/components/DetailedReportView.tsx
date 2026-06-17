"use client";

import React, { useState } from "react";
import { HistoryRecord } from "@/context/HealthContext";
import { 
  X, 
  FileText, 
  TrendingUp, 
  Heart, 
  Thermometer, 
  Droplets, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { showSuccess } from "@/utils/toast";
import AIReportView from "./AIReportView";

interface DetailedReportViewProps {
  record: HistoryRecord;
  previousRecord?: HistoryRecord;
  onClose: () => void;
}

const DetailedReportView: React.FC<DetailedReportViewProps> = ({ record, previousRecord, onClose }) => {
  const [showAIReport, setShowAIReport] = useState(false);
  
  // Vital Signs Analysis helper functions
  const getTempAnalysis = (temp: number) => {
    if (temp >= 39.5) return { status: "Critical Fever", color: "text-rose-600", desc: "Severe hyperthermia detected. Immediate medical intervention required." };
    if (temp >= 38.0) return { status: "Moderate Fever", color: "text-amber-600", desc: "Elevated body temperature. Rest and hydration recommended." };
    if (temp < 36.0) return { status: "Low Temperature", color: "text-blue-600", desc: "Slightly low body temperature. Keep warm and monitor." };
    return { status: "Normal", color: "text-emerald-600", desc: "Body temperature is within the optimal physiological range." };
  };

  const getHeartRateAnalysis = (hr: number) => {
    if (hr >= 120) return { status: "Severe Tachycardia", color: "text-rose-600", desc: "Critically high resting heart rate. Rest immediately and stay calm." };
    if (hr >= 100) return { status: "Mild Tachycardia", color: "text-amber-600", desc: "Elevated heart rate. Avoid physical exertion and caffeine." };
    if (hr < 60) return { status: "Bradycardia", color: "text-blue-600", desc: "Low resting heart rate. Normal for athletes, otherwise monitor." };
    return { status: "Normal", color: "text-emerald-600", desc: "Resting heart rate is stable and healthy." };
  };

  const getOxygenAnalysis = (spo2: number) => {
    if (spo2 < 92) return { status: "Critical Hypoxia", color: "text-rose-600", desc: "Critically low blood oxygen level. Seek medical attention immediately." };
    if (spo2 < 95) return { status: "Mild Hypoxia", color: "text-amber-600", desc: "Slightly low oxygen saturation. Ensure proper ventilation and deep breathing." };
    return { status: "Optimal", color: "text-emerald-600", desc: "Excellent blood oxygen saturation levels." };
  };

  const getHydrationAnalysis = (hyd: number) => {
    if (hyd < 40) return { status: "Severe Dehydration", color: "text-rose-600", desc: "Critically low hydration. Drink electrolyte fluids immediately." };
    if (hyd < 60) return { status: "Mild Dehydration", color: "text-amber-600", desc: "Inadequate fluid levels. Increase water intake." };
    return { status: "Optimal", color: "text-emerald-600", desc: "Body fluid levels are well-balanced and healthy." };
  };

  // AI Health Assessment
  const getAIAssessment = () => {
    const assessments = [];
    if (record.riskLevel === "Low") {
      assessments.push("All vital signs are within normal range.");
      assessments.push("Cardiovascular and thermal regulation systems are functioning optimally.");
    } else {
      if (record.temperature >= 38.0) assessments.push("Mild fever detected. Thermal regulation is compromised.");
      if (record.heartRate >= 100) assessments.push("Elevated heart rate observed. Cardiovascular stress detected.");
      if (record.hydration < 50) assessments.push("Possible dehydration detected. Fluid volume is below safe threshold.");
      if (record.bloodOxygen < 95) assessments.push("Slightly low blood oxygen saturation observed.");
    }
    assessments.push("Continuous monitoring via HealthSense Smart Patch is recommended.");
    return assessments;
  };

  // Personalized Recommendations
  const getRecommendations = () => {
    const recs = [];
    if (record.temperature >= 38.0) {
      recs.push("Get additional rest in a cool, well-ventilated room.");
      recs.push("Monitor body temperature every 30 minutes.");
    }
    if (record.hydration < 60) {
      recs.push("Increase water intake immediately (aim for 500ml - 1L of fluids).");
      recs.push("Consider oral rehydration salts (ORS) to restore electrolyte balance.");
    }
    if (record.heartRate >= 100) {
      recs.push("Avoid physical exertion, caffeine, and stressful stimuli.");
      recs.push("Practice deep, controlled breathing exercises.");
    }
    if (record.riskLevel === "High") {
      recs.push("Seek immediate medical attention if symptoms worsen or persist.");
    } else {
      recs.push("Maintain healthy activity levels and consistent sleep patterns.");
    }
    return recs;
  };

  const handleExport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showSuccess("Please allow popups to export the PDF report.");
      return;
    }

    const formattedDate = record.timestamp.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const aiAssessmentHTML = getAIAssessment()
      .map(item => `<li>${item}</li>`)
      .join("");

    const recommendationsHTML = getRecommendations()
      .map(item => `<li>${item}</li>`)
      .join("");

    const alertsHTML = record.alerts.length > 0
      ? record.alerts.map(alert => `
          <div class="alert-card">
            <strong>${alert.title} (${alert.severity.toUpperCase()})</strong>
            <p>${alert.description}</p>
            <p style="font-size: 11px; color: #666; margin-top: 4px;">Recommendation: ${alert.recommendation}</p>
          </div>
        `).join("")
      : "<p>No alerts were generated during this reading.</p>";

    printWindow.document.write(`
      <html>
        <head>
          <title>HealthSense Medical Report - ${record.id}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #333;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo-container {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .logo-icon {
              background-color: #2563eb;
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 24px;
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              color: #1e293b;
              margin: 0;
            }
            .subtitle {
              font-size: 12px;
              color: #64748b;
              margin: 2px 0 0 0;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .meta-info {
              text-align: right;
              font-size: 13px;
              color: #475569;
            }
            .section-title {
              font-size: 18px;
              font-weight: 700;
              color: #1e293b;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            .grid-2 {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .card {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
            }
            .score-box {
              text-align: center;
              background-color: #eff6ff;
              border: 2px solid #bfdbfe;
            }
            .score-value {
              font-size: 48px;
              font-weight: 900;
              color: #2563eb;
              line-height: 1;
              margin: 10px 0;
            }
            .vitals-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .vitals-table th, .vitals-table td {
              padding: 12px 15px;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
            }
            .vitals-table th {
              background-color: #f1f5f9;
              font-weight: 700;
              color: #475569;
            }
            .badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .badge-low { background-color: #d1fae5; color: #065f46; }
            .badge-moderate { background-color: #fef3c7; color: #92400e; }
            .badge-high { background-color: #fee2e2; color: #991b1b; }
            ul {
              padding-left: 20px;
              margin: 0;
            }
            li {
              margin-bottom: 8px;
              font-size: 14px;
            }
            .alert-card {
              background-color: #fff5f5;
              border-left: 4px solid #f56565;
              padding: 12px;
              margin-bottom: 10px;
              border-radius: 0 8px 8px 0;
              font-size: 13px;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <div class="logo-icon">H</div>
              <div>
                <h1 class="title">HealthSense</h1>
                <p class="subtitle">Vasudha 2027 Science Fair Project</p>
              </div>
            </div>
            <div class="meta-info">
              <p style="margin: 0; font-weight: bold;">Medical Diagnostic Report</p>
              <p style="margin: 2px 0 0 0;">Report ID: HS-${record.id.toUpperCase()}</p>
              <p style="margin: 2px 0 0 0;">Date: ${formattedDate}</p>
              <p style="margin: 2px 0 0 0;">Time: ${formattedTime}</p>
            </div>
          </div>

          <div class="grid-2">
            <div class="card score-box">
              <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Overall Health Score</div>
              <div class="score-value">${record.healthScore}</div>
              <div style="font-size: 14px; font-weight: bold; color: #475569;">Status: ${record.overallStatus}</div>
            </div>
            <div class="card" style="display: flex; flex-col; justify-content: center; align-items: flex-start; gap: 10px;">
              <div style="font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Risk Assessment</div>
              <div>
                <span class="badge badge-${record.riskLevel.toLowerCase()}">${record.riskLevel} Risk</span>
              </div>
              <p style="font-size: 13px; color: #475569; margin-top: 10px; margin-bottom: 0;">
                This assessment is generated in real-time by the HealthSense AI engine based on continuous physiological telemetry.
              </p>
            </div>
          </div>

          <div class="section-title">Vital Signs Analysis</div>
          <table class="vitals-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Status</th>
                <th>Reference Range</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Body Temperature</strong></td>
                <td>${record.temperature}°C</td>
                <td><span style="font-weight: bold;">${getTempAnalysis(record.temperature).status}</span></td>
                <td>36.0°C - 37.5°C</td>
              </tr>
              <tr>
                <td><strong>Heart Rate</strong></td>
                <td>${record.heartRate} BPM</td>
                <td><span style="font-weight: bold;">${getHeartRateAnalysis(record.heartRate).status}</span></td>
                <td>60 - 100 BPM</td>
              </tr>
              <tr>
                <td><strong>Blood Oxygen (SpO2)</strong></td>
                <td>${record.bloodOxygen}%</td>
                <td><span style="font-weight: bold;">${getOxygenAnalysis(record.bloodOxygen).status}</span></td>
                <td>95% - 100%</td>
              </tr>
              <tr>
                <td><strong>Hydration Level</strong></td>
                <td>${record.hydration}%</td>
                <td><span style="font-weight: bold;">${getHydrationAnalysis(record.hydration).status}</span></td>
                <td>50% - 100%</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">AI Health Assessment</div>
          <div class="card" style="background-color: #f0fdf4; border-color: #bbf7d0;">
            <ul style="margin: 0; padding-left: 20px;">
              ${aiAssessmentHTML}
            </ul>
          </div>

          <div class="section-title">Personalized Recommendations</div>
          <div class="card" style="background-color: #f0f9ff; border-color: #bae6fd;">
            <ul style="margin: 0; padding-left: 20px;">
              ${recommendationsHTML}
            </ul>
          </div>

          <div class="section-title">Alert History</div>
          <div class="card">
            ${alertsHTML}
          </div>

          <div class="footer">
            <p style="margin: 0; font-weight: bold;">HealthSense AI Smart Patch Companion App Prototype</p>
            <p style="margin: 4px 0 0 0;">Developed for Vasudha 2027 Science Fair • Confidential Medical Telemetry</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showSuccess("PDF Report generated! Use the print dialog to save as PDF.");
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

  // Trend Analysis Calculations
  const getTrend = (current: number, prev?: number) => {
    if (prev === undefined) return { icon: Minus, text: "No baseline", color: "text-slate-400" };
    const diff = current - prev;
    if (diff > 0) return { icon: ArrowUpRight, text: `Increased by ${diff.toFixed(1)}`, color: "text-rose-500" };
    if (diff < 0) return { icon: ArrowDownRight, text: `Decreased by ${Math.abs(diff).toFixed(1)}`, color: "text-emerald-500" };
    return { icon: Minus, text: "Unchanged", color: "text-slate-400" };
  };

  const getScoreTrend = (current: number, prev?: number) => {
    if (prev === undefined) return { icon: Minus, text: "No baseline", color: "text-slate-400" };
    const diff = current - prev;
    if (diff > 0) return { icon: ArrowUpRight, text: `Improved by ${diff}`, color: "text-emerald-500" };
    if (diff < 0) return { icon: ArrowDownRight, text: `Declined by ${Math.abs(diff)}`, color: "text-rose-500" };
    return { icon: Minus, text: "Unchanged", color: "text-slate-400" };
  };

  const tempTrend = getTrend(record.temperature, previousRecord?.temperature);
  const hrTrend = getTrend(record.heartRate, previousRecord?.heartRate);
  const scoreTrend = getScoreTrend(record.healthScore, previousRecord?.healthScore);

  const TempTrendIcon = tempTrend.icon;
  const HrTrendIcon = hrTrend.icon;
  const ScoreTrendIcon = scoreTrend.icon;

  if (showAIReport) {
    return (
      <AIReportView 
        record={record} 
        onBack={() => setShowAIReport(false)} 
      />
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 flex items-center gap-1 text-xs font-bold"
        >
          <X className="w-4 h-4" />
          Back to History
        </button>
        <button 
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </button>
      </div>

      {/* Patient Snapshot */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 opacity-50" />
        
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Diagnostic Report</span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">Health Snapshot</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {record.timestamp.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })} • {record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskColor(record.riskLevel)}`}>
              {record.riskLevel} Risk
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Health Score</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{record.healthScore}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-center flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Overall Status</span>
            <span className="text-xs font-bold text-slate-800 mt-2 block leading-tight">
              {record.overallStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Vital Signs Analysis */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Vital Signs Analysis</h3>
        
        <div className="space-y-3.5">
          {/* Temperature */}
          <div className="flex gap-3 items-start pb-3 border-b border-slate-50">
            <span className="p-2 bg-orange-50 text-orange-600 rounded-xl mt-0.5">
              <Thermometer className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h4 className="text-xs font-bold text-slate-800">Body Temperature</h4>
                <span className="text-xs font-bold text-slate-900">{record.temperature}°C</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-bold ${getTempAnalysis(record.temperature).color}`}>
                  {getTempAnalysis(record.temperature).status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {getTempAnalysis(record.temperature).desc}
              </p>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="flex gap-3 items-start pb-3 border-b border-slate-50">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl mt-0.5">
              <Heart className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h4 className="text-xs font-bold text-slate-800">Heart Rate</h4>
                <span className="text-xs font-bold text-slate-900">{record.heartRate} BPM</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-bold ${getHeartRateAnalysis(record.heartRate).color}`}>
                  {getHeartRateAnalysis(record.heartRate).status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {getHeartRateAnalysis(record.heartRate).desc}
              </p>
            </div>
          </div>

          {/* Blood Oxygen */}
          <div className="flex gap-3 items-start pb-3 border-b border-slate-50">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
              <Activity className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h4 className="text-xs font-bold text-slate-800">Blood Oxygen (SpO2)</h4>
                <span className="text-xs font-bold text-slate-900">{record.bloodOxygen}%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-bold ${getOxygenAnalysis(record.bloodOxygen).color}`}>
                  {getOxygenAnalysis(record.bloodOxygen).status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {getOxygenAnalysis(record.bloodOxygen).desc}
              </p>
            </div>
          </div>

          {/* Hydration */}
          <div className="flex gap-3 items-start">
            <span className="p-2 bg-sky-50 text-sky-600 rounded-xl mt-0.5">
              <Droplets className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h4 className="text-xs font-bold text-slate-800">Hydration Level</h4>
                <span className="text-xs font-bold text-slate-900">{record.hydration}%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-bold ${getHydrationAnalysis(record.hydration).color}`}>
                  {getHydrationAnalysis(record.hydration).status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {getHydrationAnalysis(record.hydration).desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Health Assessment */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 border border-blue-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">AI Health Assessment</h3>
        </div>
        <ul className="space-y-2">
          {getAIAssessment().map((assessment, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span>{assessment}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Personalized Recommendations</h3>
        <div className="space-y-2">
          {getRecommendations().map((rec, index) => (
            <div key={index} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 font-medium leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Trend Analysis</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {/* Health Score Trend */}
          <div className="bg-slate-50 p-3 rounded-2xl text-center space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Health Score</span>
            <div className="flex items-center justify-center gap-1">
              <ScoreTrendIcon className={`w-4 h-4 ${scoreTrend.color}`} />
              <span className="text-xs font-bold text-slate-800">{record.healthScore}</span>
            </div>
            <span className="text-[9px] font-semibold text-slate-500 block leading-tight">
              {scoreTrend.text}
            </span>
          </div>

          {/* Temp Trend */}
          <div className="bg-slate-50 p-3 rounded-2xl text-center space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Temperature</span>
            <div className="flex items-center justify-center gap-1">
              <TempTrendIcon className={`w-4 h-4 ${tempTrend.color}`} />
              <span className="text-xs font-bold text-slate-800">{record.temperature}°C</span>
            </div>
            <span className="text-[9px] font-semibold text-slate-500 block leading-tight">
              {tempTrend.text}
            </span>
          </div>

          {/* HR Trend */}
          <div className="bg-slate-50 p-3 rounded-2xl text-center space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Heart Rate</span>
            <div className="flex items-center justify-center gap-1">
              <HrTrendIcon className={`w-4 h-4 ${hrTrend.color}`} />
              <span className="text-xs font-bold text-slate-800">{record.heartRate}</span>
            </div>
            <span className="text-[9px] font-semibold text-slate-500 block leading-tight">
              {hrTrend.text}
            </span>
          </div>
        </div>
      </div>

      {/* Alert History */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Alert History</h3>
        </div>
        
        {record.alerts.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No alerts were generated during this reading.</p>
        ) : (
          <div className="space-y-2">
            {record.alerts.map((alert, index) => (
              <div key={index} className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900">{alert.title}</h4>
                  <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate AI Health Report Button */}
      <button
        onClick={() => setShowAIReport(true)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-blue-100 transition-all text-xs"
      >
        <Sparkles className="w-4 h-4" />
        Generate AI Health Report
      </button>
    </div>
  );
};

export default DetailedReportView;