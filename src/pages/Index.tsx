"use client";

import React from "react";
import { HealthProvider, useHealth } from "@/context/HealthContext";
import BottomNav from "@/components/BottomNav";
import DashboardTab from "@/components/DashboardTab";
import ReportTab from "@/components/ReportTab";
import HistoryTab from "@/components/HistoryTab";
import JudgeDemoTab from "@/components/JudgeDemoTab";
import AlertsTab from "@/components/AlertsTab";
import AboutTab from "@/components/AboutTab";
import AIReportView from "@/components/AIReportView";
import { MadeWithDyad } from "@/components/made-with-dyad";

const AppContent: React.FC = () => {
  const { activeTab } = useHealth();

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "report":
        return <ReportTab />;
      case "history":
        return <HistoryTab />;
      case "demo":
        return <JudgeDemoTab />;
      case "alerts":
        return <AlertsTab />;
      case "about":
        return <AboutTab />;
      case "ai-report":
        return <AIReportView />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-8">
      {/* Mobile Phone Frame Mockup */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:max-h-[850px] sm:rounded-[40px] sm:shadow-2xl sm:border-[12px] sm:border-slate-900 relative flex flex-col overflow-y-auto overflow-x-hidden scrollbar-none">
        {/* Phone Notch / Speaker */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50">
          <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mt-1.5" />
        </div>

        {/* App Content Area */}
        <div className="flex-1 bg-slate-50/50 pt-2 sm:pt-6">
          {renderTabContent()}
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* Science Fair Project Footer */}
      <div className="mt-6 text-center hidden sm:block space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vasudha 2027 Science Fair Project</p>
        <p className="text-[11px] text-slate-400">HealthSense AI Smart Patch Companion App Prototype</p>
        <div className="pt-2">
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
};

export default Index;