"use client";

import React from "react";
import { useHealth } from "@/context/HealthContext";
import { LayoutDashboard, FileText, History, ShieldAlert, Info, Cpu } from "lucide-react";

const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, alerts } = useHealth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "report", label: "Report", icon: FileText },
    { id: "history", label: "History", icon: History },
    { id: "demo", label: "Judge Demo", icon: Cpu },
    { id: "alerts", label: "Alerts", icon: ShieldAlert, badge: alerts.length },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-lg z-50 max-w-md mx-auto rounded-t-2xl">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
                isActive ? "text-blue-600 scale-105" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div className="relative p-1">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-5 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;