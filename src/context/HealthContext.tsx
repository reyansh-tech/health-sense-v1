"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";

export type RiskLevel = "Low" | "Moderate" | "High";
export type ConnectionStatus = "Connected" | "Connecting" | "Disconnected";

export interface HealthReadings {
  temperature: number;
  heartRate: number;
  bloodOxygen: number;
  hydration: number;
  healthScore: number;
  riskLevel: RiskLevel;
  timestamp: Date;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  timestamp: Date;
  recommendation: string;
}

export interface HistoryRecord {
  id: string;
  temperature: number;
  heartRate: number;
  bloodOxygen: number;
  hydration: number;
  healthScore: number;
  riskLevel: RiskLevel;
  timestamp: Date;
  overallStatus: string;
  alerts: AlertItem[];
}

interface HealthContextType {
  readings: HealthReadings;
  connectionStatus: ConnectionStatus;
  history: HistoryRecord[];
  alerts: AlertItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  applyScenario: (scenario: "healthy" | "fever" | "critical" | "dehydration") => void;
  saveCurrentReading: () => void;
  clearHistory: () => void;
  deleteHistoryRecord: (id: string) => void;
  triggerEmergency: () => void;
  dismissAlert: (id: string) => void;
  aiInsights: string[];
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

const initialReadings: HealthReadings = {
  temperature: 36.5,
  heartRate: 72,
  bloodOxygen: 98,
  hydration: 85,
  healthScore: 96,
  riskLevel: "Low",
  timestamp: new Date(),
};

const initialHistory: HistoryRecord[] = [
  {
    id: "1",
    temperature: 36.6,
    heartRate: 70,
    bloodOxygen: 99,
    hydration: 80,
    healthScore: 98,
    riskLevel: "Low",
    overallStatus: "Excellent",
    alerts: [],
    timestamp: new Date(Date.now() - 3600000 * 4),
  },
  {
    id: "2",
    temperature: 36.8,
    heartRate: 75,
    bloodOxygen: 97,
    hydration: 78,
    healthScore: 94,
    riskLevel: "Low",
    overallStatus: "Stable",
    alerts: [],
    timestamp: new Date(Date.now() - 3600000 * 8),
  },
  {
    id: "3",
    temperature: 37.2,
    heartRate: 82,
    bloodOxygen: 96,
    hydration: 65,
    healthScore: 85,
    riskLevel: "Moderate",
    overallStatus: "Slightly Elevated",
    alerts: [],
    timestamp: new Date(Date.now() - 3600000 * 12),
  },
];

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [readings, setReadings] = useState<HealthReadings>(initialReadings);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("Connected");
  const [history, setHistory] = useState<HistoryRecord[]>(initialHistory);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [aiInsights, setAiInsights] = useState<string[]>([
    "No abnormal readings detected.",
    "Hydration level is optimal.",
    "Health status is stable and excellent.",
  ]);

  // Generate AI Insights based on current readings
  useEffect(() => {
    const insights: string[] = [];
    if (readings.riskLevel === "Low") {
      insights.push("All vital signs are within the optimal physiological range.");
      insights.push(readings.hydration > 70 ? "Hydration level is normal." : "Hydration is slightly low, drink some water.");
      insights.push("Health status stable. Keep up the healthy lifestyle!");
    } else if (readings.riskLevel === "Moderate") {
      if (readings.temperature >= 38) {
        insights.push("Mild fever detected. Rest and monitor temperature.");
      }
      if (readings.heartRate > 90) {
        insights.push("Heart rate is slightly elevated. Avoid strenuous activity.");
      }
      if (readings.hydration < 50) {
        insights.push("Dehydration warning. Drink electrolyte fluids immediately.");
      }
      insights.push("Overall health status is moderate. Monitor closely.");
    } else {
      insights.push("CRITICAL: Vital signs are outside safe thresholds.");
      if (readings.temperature >= 39.5) {
        insights.push("High fever detected. Seek medical attention if it persists.");
      }
      if (readings.heartRate > 110) {
        insights.push("Tachycardia detected. Rest immediately and stay calm.");
      }
      if (readings.bloodOxygen < 92) {
        insights.push("Low blood oxygen level. Ensure proper ventilation.");
      }
      insights.push("Immediate medical consultation or rest is highly recommended.");
    }
    setAiInsights(insights);
  }, [readings]);

  const applyScenario = (scenario: "healthy" | "fever" | "critical" | "dehydration") => {
    let newReadings: HealthReadings;
    let newAlerts: AlertItem[] = [];

    switch (scenario) {
      case "healthy":
        newReadings = {
          temperature: 36.5,
          heartRate: 72,
          bloodOxygen: 98,
          hydration: 85,
          healthScore: 95,
          riskLevel: "Low",
          timestamp: new Date(),
        };
        showSuccess("Healthy Mode activated! Vitals are optimal.");
        break;

      case "fever":
        newReadings = {
          temperature: 38.2,
          heartRate: 95,
          bloodOxygen: 96,
          hydration: 60,
          healthScore: 82,
          riskLevel: "Moderate",
          timestamp: new Date(),
        };
        newAlerts = [
          {
            id: "alert-fever",
            title: "Mild Fever Detected",
            description: `Body temperature is elevated at ${newReadings.temperature}°C.`,
            severity: "warning",
            timestamp: new Date(),
            recommendation: "Drink plenty of fluids, rest, and take paracetamol if prescribed. Monitor temperature every 30 minutes.",
          },
        ];
        showSuccess("Fever Mode activated. Simulated alert triggered.");
        break;

      case "critical":
        newReadings = {
          temperature: 40.1,
          heartRate: 125,
          bloodOxygen: 91,
          hydration: 45,
          healthScore: 45,
          riskLevel: "High",
          timestamp: new Date(),
        };
        newAlerts = [
          {
            id: "alert-critical-temp",
            title: "High Fever Alert",
            description: `Critical body temperature detected at ${newReadings.temperature}°C.`,
            severity: "critical",
            timestamp: new Date(),
            recommendation: "Apply cold compresses immediately. Seek urgent medical attention.",
          },
          {
            id: "alert-critical-hr",
            title: "Tachycardia Alert",
            description: `Heart rate is critically high at ${newReadings.heartRate} BPM.`,
            severity: "critical",
            timestamp: new Date(),
            recommendation: "Sit down, practice deep breathing, and avoid any movement. Contact emergency services if chest pain occurs.",
          },
        ];
        showError("CRITICAL Mode activated! Multiple high-severity alerts triggered.");
        break;

      case "dehydration":
        newReadings = {
          temperature: 37.8,
          heartRate: 105,
          bloodOxygen: 95,
          hydration: 32,
          healthScore: 60,
          riskLevel: "Moderate",
          timestamp: new Date(),
        };
        newAlerts = [
          {
            id: "alert-dehydration",
            title: "Severe Dehydration Warning",
            description: `Hydration level is critically low at ${newReadings.hydration}%.`,
            severity: "warning",
            timestamp: new Date(),
            recommendation: "Drink 500ml of water or oral rehydration salts (ORS) immediately. Avoid caffeine and physical exertion.",
          },
        ];
        showSuccess("Dehydration Mode activated. Hydration warning triggered.");
        break;
    }

    setReadings(newReadings);
    setAlerts(newAlerts);
  };

  const getOverallStatus = (score: number, risk: RiskLevel) => {
    if (risk === "High") return "Critical Condition";
    if (risk === "Moderate") {
      if (readings.hydration < 50) return "Dehydrated State";
      return "Slightly Elevated Vitals";
    }
    if (score >= 95) return "Excellent Health";
    return "Stable Condition";
  };

  const saveCurrentReading = () => {
    const status = getOverallStatus(readings.healthScore, readings.riskLevel);
    const newRecord: HistoryRecord = {
      id: Math.random().toString(36).substring(2, 9),
      temperature: readings.temperature,
      heartRate: readings.heartRate,
      bloodOxygen: readings.bloodOxygen,
      hydration: readings.hydration,
      healthScore: readings.healthScore,
      riskLevel: readings.riskLevel,
      overallStatus: status,
      alerts: [...alerts],
      timestamp: new Date(),
    };
    setHistory((prev) => [newRecord, ...prev]);
    showSuccess("Current health reading saved to history successfully!");
  };

  const clearHistory = () => {
    setHistory([]);
    showSuccess("Health history cleared.");
  };

  const deleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showSuccess("Record deleted.");
  };

  const triggerEmergency = () => {
    const emergencyAlert: AlertItem = {
      id: "alert-emergency-" + Date.now(),
      title: "EMERGENCY ALERT TRIGGERED",
      description: "User manually triggered an emergency SOS alert.",
      severity: "critical",
      timestamp: new Date(),
      recommendation: "Emergency contacts and medical services are being notified with your GPS location. Stay calm and wait for assistance.",
    };
    setAlerts((prev) => [emergencyAlert, ...prev]);
    showError("SOS Emergency Alert Sent! Simulated emergency services notified.");
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    showSuccess("Alert dismissed.");
  };

  return (
    <HealthContext.Provider
      value={{
        readings,
        connectionStatus,
        history,
        alerts,
        activeTab,
        setActiveTab,
        setConnectionStatus,
        applyScenario,
        saveCurrentReading,
        clearHistory,
        deleteHistoryRecord,
        triggerEmergency,
        dismissAlert,
        aiInsights,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error("useHealth must be used within a HealthProvider");
  }
  return context;
};