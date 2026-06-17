"use client";

import React from "react";
import { useHealth, AlertItem } from "@/context/HealthContext";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  X,
  PhoneCall
} from "lucide-react";

const AlertsTab: React.FC = () => {
  const { alerts, dismissAlert, triggerEmergency } = useHealth();

  const getSeverityStyles = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-rose-50 border-rose-200",
          text: "text-rose-800",
          icon: AlertTriangle,
          iconColor: "text-rose-600 bg-rose-100",
          badge: "bg-rose-600 text-white"
        };
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-800",
          icon: AlertTriangle,
          iconColor: "text-amber-600 bg-amber-100",
          badge: "bg-amber-500 text-white"
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: Info,
          iconColor: "text-blue-600 bg-blue-100",
          badge: "bg-blue-600 text-white"
        };
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Alert Center</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time Health Notifications</p>
        </div>
        {alerts.length > 0 && (
          <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
            {alerts.length} Active
          </span>
        )}
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-sm">All Systems Normal</h3>
            <p className="text-xs text-slate-500 max-w-[220px] mx-auto">
              No active alerts. The Smart Patch is continuously monitoring your vitals.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            const Icon = styles.icon;

            return (
              <div 
                key={alert.id}
                className={`rounded-2xl border p-4 shadow-sm relative overflow-hidden flex flex-col gap-3 ${styles.bg}`}
              >
                {/* Top Row: Title & Dismiss */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg ${styles.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${styles.badge}`}>
                        {alert.severity}
                      </span>
                      <h3 className="font-bold text-slate-900 text-xs mt-1">{alert.title}</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {alert.description}
                </p>

                {/* AI Recommendation */}
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block">AI Recommendation</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {alert.recommendation}
                  </p>
                </div>

                {/* Timestamp */}
                <span className="text-[9px] font-semibold text-slate-400">
                  Triggered at: {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            );
          })}

          {/* Emergency SOS Quick Action */}
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <h4 className="font-bold text-rose-900 text-xs">Need Immediate Help?</h4>
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              If you are experiencing chest pain, shortness of breath, or severe dizziness, trigger the SOS emergency alert immediately.
            </p>
            <button
              onClick={triggerEmergency}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all"
            >
              Trigger SOS Emergency
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsTab;