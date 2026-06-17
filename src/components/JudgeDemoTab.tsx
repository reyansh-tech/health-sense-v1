"use client";

import React from "react";
import { useHealth } from "@/context/HealthContext";
import { 
  Cpu, 
  CheckCircle, 
  Flame, 
  AlertOctagon, 
  Droplet, 
  Sparkles,
  ArrowRight
} from "lucide-react";

const JudgeDemoTab: React.FC = () => {
  const { applyScenario, readings, setActiveTab } = useHealth();

  const scenarios = [
    {
      id: "healthy" as const,
      title: "Healthy Mode",
      description: "Simulates optimal physiological parameters of a healthy individual at rest.",
      icon: CheckCircle,
      color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/50",
      iconBg: "bg-emerald-500 text-white",
      vitals: {
        temp: "36.5°C",
        hr: "72 BPM",
        spo2: "98%",
        hydration: "85%",
        score: "95",
        risk: "Low"
      }
    },
    {
      id: "fever" as const,
      title: "Fever Mode",
      description: "Simulates a moderate fever condition with elevated temperature and heart rate.",
      icon: Flame,
      color: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/50",
      iconBg: "bg-amber-500 text-white",
      vitals: {
        temp: "38.2°C",
        hr: "95 BPM",
        spo2: "96%",
        hydration: "60%",
        score: "82",
        risk: "Moderate"
      }
    },
    {
      id: "critical" as const,
      title: "Critical Mode",
      description: "Simulates a high-severity medical emergency with extreme fever and tachycardia.",
      icon: AlertOctagon,
      color: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/50",
      iconBg: "bg-rose-500 text-white",
      vitals: {
        temp: "40.1°C",
        hr: "125 BPM",
        spo2: "91%",
        hydration: "45%",
        score: "45",
        risk: "High"
      }
    },
    {
      id: "dehydration" as const,
      title: "Dehydration Mode",
      description: "Simulates severe dehydration with low fluid levels and elevated heart rate.",
      icon: Droplet,
      color: "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100/50",
      iconBg: "bg-sky-500 text-white",
      vitals: {
        temp: "37.8°C",
        hr: "105 BPM",
        spo2: "95%",
        hydration: "32%",
        score: "60",
        risk: "Moderate"
      }
    }
  ];

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="bg-blue-600 text-white p-1 rounded-lg">
            <Cpu className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Judge Demo Panel</h1>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Interactive Science Fair Simulation Controls</p>
      </div>

      {/* Explanation Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-md space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-sm">How to Present to Judges</h3>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          HealthSense uses simulated sensor data to demonstrate real-time health monitoring. 
          Click any scenario below to instantly update the dashboard, trigger AI alerts, and generate custom recommendations.
        </p>
      </div>

      {/* Scenarios List */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm px-1">Select a Scenario to Simulate</h3>
        
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <button
              key={scenario.id}
              onClick={() => {
                applyScenario(scenario.id);
                setActiveTab("dashboard");
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 shadow-sm ${scenario.color}`}
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-2.5">
                  <span className={`p-2 rounded-xl ${scenario.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{scenario.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{scenario.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
              </div>

              {/* Vitals Preview Grid */}
              <div className="grid grid-cols-5 gap-1 bg-white/80 backdrop-blur-sm p-2.5 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase block">Temp</span>
                  <span className="text-[11px] font-bold text-slate-800">{scenario.vitals.temp}</span>
                </div>
                <div className="border-l border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block">Heart</span>
                  <span className="text-[11px] font-bold text-slate-800">{scenario.vitals.hr}</span>
                </div>
                <div className="border-l border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block">SpO2</span>
                  <span className="text-[11px] font-bold text-slate-800">{scenario.vitals.spo2}</span>
                </div>
                <div className="border-l border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block">Hydr.</span>
                  <span className="text-[11px] font-bold text-slate-800">{scenario.vitals.hydration}</span>
                </div>
                <div className="border-l border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase block">Score</span>
                  <span className="text-[11px] font-bold text-slate-800">{scenario.vitals.score}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JudgeDemoTab;