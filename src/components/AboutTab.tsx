"use client";

import React from "react";
import { 
  Info, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  Cpu
} from "lucide-react";

const AboutTab: React.FC = () => {
  const benefits = [
    "Early disease detection through continuous vital analysis",
    "Continuous 24/7 non-invasive health monitoring",
    "Affordable and accessible preventive healthcare",
    "Real-time reporting and instant emergency alerts",
    "Personalized AI-driven health recommendations"
  ];

  const futureScope = [
    "Non-invasive continuous glucose monitoring",
    "Advanced Bluetooth Low Energy (BLE) connectivity",
    "Secure cloud-based electronic health records (EHR)",
    "Direct integration with hospital and doctor portals",
    "Predictive AI modeling for early disease onset detection"
  ];

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="bg-blue-600 text-white p-1 rounded-lg">
          <Award className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vasudha 2027</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Science Fair Project Presentation</p>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Project Overview</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-blue-600">HealthSense</span> is an AI-powered smart health monitoring patch prototype designed to continuously track vital signs and provide early disease detection, preventive healthcare, and real-time health reporting.
        </p>
      </div>

      {/* Problem Statement */}
      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-rose-600" />
          <h3 className="font-bold text-rose-900 text-sm">The Problem</h3>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Many critical health conditions and diseases are detected too late because individuals do not continuously monitor their vital signs. Traditional healthcare is often reactive rather than preventive, leading to delayed treatments and higher medical costs.
        </p>
      </div>

      {/* Solution */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-emerald-900 text-sm">The Solution</h3>
        </div>
        <p className="text-xs text-emerald-700 leading-relaxed">
          HealthSense bridges this gap by offering a wearable smart patch that continuously monitors body temperature, heart rate, blood oxygen, and hydration. The companion mobile app uses AI to analyze trends, provide instant insights, and alert users of potential health risks.
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Key Benefits</h3>
        <ul className="space-y-2.5">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Future Scope */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">Future Scope</h3>
        </div>
        <ul className="space-y-2.5">
          {futureScope.map((scope, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span>{scope}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer / Credits */}
      <div className="text-center pt-4 pb-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Developed for Vasudha 2027</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Smart Healthcare Innovation Project</p>
      </div>
    </div>
  );
};

export default AboutTab;