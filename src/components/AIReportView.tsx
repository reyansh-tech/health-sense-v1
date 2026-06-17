"use client";

import React from "react";
import { useHealth, HistoryRecord, HealthReadings } from "@/context/HealthContext";
import { 
  ArrowLeft, 
  Sparkles, 
  Activity, 
  Thermometer, 
  Heart, 
  Droplets, 
  ShieldAlert, 
  Clock, 
  Stethoscope, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Download,
  FileText
} from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface AIReportViewProps {
  record?: HistoryRecord;
  onBack?: () => void;
}

const AIReportView: React.FC<AIReportViewProps> = ({ record, onBack }) => {
  const { readings: liveReadings, history, setActiveTab } = useHealth();

  // Use historical record if provided, otherwise use live readings
  const data: HealthReadings | HistoryRecord = record || liveReadings;
  const isHistory = !!record;

  // Find previous record for trend analysis
  const getPreviousRecord = () => {
    if (isHistory && record) {
      const currentIndex = history.findIndex(r => r.id === record.id);
      if (currentIndex !== -1 && currentIndex < history.length - 1) {
        return history[currentIndex + 1];
      }
    } else if (history.length > 0) {
      return history[0];
    }
    return undefined;
  };

  const prevRecord = getPreviousRecord();

  // Generate dynamic report content based on vitals
  const generateReportContent = () => {
    const temp = data.temperature;
    const hr = data.heartRate;
    const spo2 = data.bloodOxygen;
    const hyd = data.hydration;
    const score = data.healthScore;
    const risk = data.riskLevel;

    let executiveSummary = "";
    let tempAnalysis = "";
    let hrAnalysis = "";
    let spo2Analysis = "";
    let hydAnalysis = "";
    let riskReasoning = "";
    let recommendations: string[] = [];
    let monitoringAdvice = "";
    let trendSummary = "";
    let doctorSummary = "";

    // 1. Executive Summary & Scenario Detection
    if (risk === "Low") {
      executiveSummary = `The patient's physiological parameters are highly stable and within optimal reference ranges. Overall metabolic and cardiovascular functions show excellent efficiency, with no immediate clinical concerns detected. Continuous monitoring indicates a strong baseline of wellness.`;
      riskReasoning = `Classified as Low Risk due to all vital signs remaining strictly within standard physiological thresholds. There are no signs of thermal dysregulation, cardiovascular stress, or systemic dehydration.`;
      recommendations = [
        "Maintain current hydration levels by consuming 2-2.5 liters of water daily.",
        "Continue regular physical activity and balanced nutrition to support cardiovascular health.",
        "Ensure consistent sleep hygiene (7-8 hours of quality sleep nightly).",
        "Keep the Smart Patch active for continuous baseline tracking."
      ];
      monitoringAdvice = `Over the next 24 hours, continue standard monitoring. No special precautions are required. Maintain normal daily routines and log any strenuous physical activities.`;
      doctorSummary = `Pt presents with stable vitals. Temp: ${temp}°C, HR: ${hr} BPM, SpO2: ${spo2}%, Hydration: ${hyd}%. All parameters within normal limits. No acute distress or clinical intervention indicated at this time. Recommend routine follow-up.`;
    } else if (temp >= 39.5 || hr >= 120) {
      // Critical Mode
      executiveSummary = `CRITICAL ALERT: The patient is exhibiting severe physiological distress characterized by high-grade hyperthermia and marked tachycardia. Immediate clinical evaluation is strongly advised as these parameters indicate acute systemic stress or infection.`;
      riskReasoning = `Classified as High Risk due to critical body temperature (${temp}°C) and severe tachycardia (${hr} BPM). These values are significantly outside safe physiological limits and pose immediate health risks if left unmanaged.`;
      recommendations = [
        "Seek immediate medical attention or consult a healthcare professional.",
        "Apply cool, damp compresses to the forehead and body to assist thermal regulation.",
        "Rest in a cool, well-ventilated room and avoid all physical exertion.",
        "Sip small amounts of water or electrolyte solutions if conscious and able to swallow."
      ];
      monitoringAdvice = `Over the next 24 hours, vitals must be monitored continuously. Check temperature and heart rate every 15-30 minutes. Document any additional symptoms such as chills, confusion, or chest pain for medical staff.`;
      doctorSummary = `Pt exhibits acute physiological distress. Significant hyperthermia (Temp: ${temp}°C) accompanied by severe tachycardia (HR: ${hr} BPM). SpO2 is borderline at ${spo2}%. Immediate clinical assessment and intervention recommended to rule out systemic infection or acute cardiovascular event.`;
    } else if (temp >= 38.0) {
      // Fever Mode
      executiveSummary = `The patient is presenting with moderate physiological fluctuations, primarily driven by an elevated body temperature indicating a mild to moderate fever. Cardiovascular response is appropriately elevated to support immune function, but requires close observation.`;
      riskReasoning = `Classified as Moderate Risk due to elevated body temperature (${temp}°C) and a corresponding rise in resting heart rate (${hr} BPM). While not immediately life-threatening, these parameters indicate an active immune response or mild heat stress.`;
      recommendations = [
        "Prioritize complete bed rest to allow the body to recover.",
        "Increase fluid intake (water, herbal teas, or diluted juices) to prevent dehydration from fever.",
        "Monitor temperature fluctuations every 1-2 hours.",
        "Consider over-the-counter antipyretics (e.g., paracetamol) if recommended by a doctor."
      ];
      monitoringAdvice = `Over the next 24 hours, monitor temperature and hydration levels closely. Avoid strenuous activities and heavy meals. If temperature exceeds 39°C or is accompanied by severe headache, seek medical advice.`;
      doctorSummary = `Pt presents with moderate pyrexia (Temp: ${temp}°C) and mild tachycardia (HR: ${hr} BPM). SpO2 (${spo2}%) and Hydration (${hyd}%) remain stable. Findings consistent with mild systemic infection or inflammatory response. Recommend rest, hydration, and symptomatic monitoring.`;
    } else {
      // Dehydration Mode
      executiveSummary = `The patient is experiencing moderate physiological stress characterized by a significant deficit in body fluid volume (dehydration). This has triggered a compensatory increase in heart rate to maintain cardiac output, requiring prompt rehydration.`;
      riskReasoning = `Classified as Moderate Risk due to critically low hydration levels (${hyd}%) and elevated heart rate (${hr} BPM). Dehydration reduces blood volume, forcing the heart to beat faster to deliver oxygen to tissues.`;
      recommendations = [
        "Consume 500ml to 1L of water or oral rehydration salts (ORS) immediately.",
        "Avoid caffeinated, sugary, or alcoholic beverages as they exacerbate fluid loss.",
        "Rest in a cool environment and avoid physical exertion until hydration levels recover.",
        "Monitor fluid intake and urine color (aim for pale yellow/clear)."
      ];
      monitoringAdvice = `Over the next 24 hours, focus entirely on fluid restoration. Monitor hydration levels on the app every hour. Ensure regular intake of electrolyte-rich fluids and avoid hot environments.`;
      doctorSummary = `Pt presents with clinical signs of moderate dehydration (Hydration: ${hyd}%) and compensatory tachycardia (HR: ${hr} BPM). Core temperature is slightly elevated at ${temp}°C. Recommend immediate oral rehydration therapy and monitoring of fluid balance.`;
    }

    // 2. Vital Signs Analysis Details
    tempAnalysis = temp >= 39.5 
      ? `CRITICAL: High-grade fever detected at ${temp}°C. Core temperature is dangerously elevated.`
      : temp >= 38.0
      ? `ELEVATED: Moderate fever detected at ${temp}°C. Indicates active immune response.`
      : `NORMAL: Body temperature is stable at ${temp}°C, within the healthy reference range (36.0°C - 37.5°C).`;

    hrAnalysis = hr >= 120
      ? `CRITICAL: Severe tachycardia detected at ${hr} BPM. Heart rate is dangerously high at rest.`
      : hr >= 90
      ? `ELEVATED: Mild tachycardia detected at ${hr} BPM. Heart is working harder to compensate for fever or dehydration.`
      : `NORMAL: Resting heart rate is stable at ${hr} BPM, within the optimal range (60 - 90 BPM).`;

    spo2Analysis = spo2 < 92
      ? `CRITICAL: Hypoxia detected at ${spo2}%. Oxygen saturation is below safe levels.`
      : spo2 < 95
      ? `BORDERLINE: Mild oxygen desaturation at ${spo2}%. Monitor breathing patterns.`
      : `OPTIMAL: Excellent blood oxygen saturation at ${spo2}%, indicating efficient pulmonary function.`;

    hydAnalysis = hyd < 40
      ? `CRITICAL: Severe dehydration detected at ${hyd}%. Immediate fluid replacement is vital.`
      : hyd < 60
      ? `INADEQUATE: Mild dehydration detected at ${hyd}%. Fluid intake should be increased.`
      : `OPTIMAL: Well-hydrated at ${hyd}%. Cellular fluid balance is excellent.`;

    // 6. Trend Summary
    if (prevRecord) {
      const scoreDiff = score - prevRecord.healthScore;
      const tempDiff = temp - prevRecord.temperature;
      const hrDiff = hr - prevRecord.heartRate;

      let scoreText = scoreDiff > 0 ? `improved by ${scoreDiff} points` : scoreDiff < 0 ? `declined by ${Math.abs(scoreDiff)} points` : "remained stable";
      let tempText = tempDiff > 0 ? `increased by ${tempDiff.toFixed(1)}°C` : tempDiff < 0 ? `decreased by ${Math.abs(tempDiff).toFixed(1)}°C` : "remained unchanged";
      let hrText = hrDiff > 0 ? `increased by ${hrDiff} BPM` : hrDiff < 0 ? `decreased by ${Math.abs(hrDiff)} BPM` : "remained unchanged";

      trendSummary = `Compared to the previous baseline reading saved on ${prevRecord.timestamp.toLocaleDateString()} at ${prevRecord.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, your overall health score has ${scoreText}. Your body temperature has ${tempText}, and your heart rate has ${hrText}.`;
    } else {
      trendSummary = `This is your initial saved reading. A comprehensive trend analysis will be generated automatically once subsequent readings are saved to establish a baseline.`;
    }

    return {
      executiveSummary,
      tempAnalysis,
      hrAnalysis,
      spo2Analysis,
      hydAnalysis,
      riskReasoning,
      recommendations,
      monitoringAdvice,
      trendSummary,
      doctorSummary
    };
  };

  const report = generateReportContent();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack ? onBack : () => setActiveTab("dashboard")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-1.5">
          <span className="bg-blue-600 text-white p-1 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-blue-600">AI Generated</span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Health Analysis</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {isHistory ? "Historical Record Analysis" : "Real-time Smart Patch Diagnostic"}
        </p>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -z-10 opacity-40" />
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">1. Executive Summary</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {report.executiveSummary}
        </p>
      </div>

      {/* Vital Signs Analysis */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">2. Vital Signs Analysis</h3>
        </div>

        <div className="space-y-3">
          {/* Temp */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                Body Temperature
              </span>
              <span className="text-xs font-extrabold text-slate-900">{data.temperature}°C</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{report.tempAnalysis}</p>
          </div>

          {/* HR */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Heart Rate
              </span>
              <span className="text-xs font-extrabold text-slate-900">{data.heartRate} BPM</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{report.hrAnalysis}</p>
          </div>

          {/* SpO2 */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                Blood Oxygen (SpO2)
              </span>
              <span className="text-xs font-extrabold text-slate-900">{data.bloodOxygen}%</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{report.spo2Analysis}</p>
          </div>

          {/* Hydration */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                Hydration Level
              </span>
              <span className="text-xs font-extrabold text-slate-900">{data.hydration}%</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{report.hydAnalysis}</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">3. Risk Assessment</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Classification:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            data.riskLevel === "Low" 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : data.riskLevel === "Moderate"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
          }`}>
            {data.riskLevel} Risk
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {report.riskReasoning}
        </p>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">4. AI Recommendations</h3>
        </div>
        <div className="space-y-2">
          {report.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 font-medium leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Monitoring Advice */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">5. Future Monitoring Advice</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {report.monitoringAdvice}
        </p>
      </div>

      {/* Health Trend Summary */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">6. Health Trend Summary</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {report.trendSummary}
        </p>
      </div>

      {/* Doctor Summary */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-sm">7. Clinical Summary (For Doctor)</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono bg-black/20 p-3 rounded-xl border border-white/10">
          {report.doctorSummary}
        </p>
        <button 
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
        >
          <Download className="w-4 h-4" />
          Print Clinical Summary
        </button>
      </div>
    </div>
  );
};

export default AIReportView;