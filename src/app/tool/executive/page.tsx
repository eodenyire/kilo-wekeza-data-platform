"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, SeverityBadge, DataTable, PageHeader } from "@/components/ui/Cards";

interface KpiMetric {
  id: number;
  name: string;
  category: string;
  value: number;
  previousValue: number | null;
  unit: string | null;
  trend: string | null;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  confidence: number | null;
  impact: string;
  status: string;
}

interface Scenario {
  id: number;
  name: string;
  description: string | null;
  parameters: string;
  predictedOutcome: string | null;
  confidence: number | null;
}

interface ExecutiveAlert {
  id: number;
  title: string;
  message: string;
  severity: string;
  source: string | null;
  status: string;
}

export default function ExecutivePage() {
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [alerts, setAlerts] = useState<ExecutiveAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/executive")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setKpis(d.data.kpis || []);
          setRecommendations(d.data.recommendations || []);
          setScenarios(d.data.scenarios || []);
          setAlerts(d.data.alerts || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/executive">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  const pendingRecs = recommendations.filter((r) => r.status === "pending");

  return (
    <ToolLayout currentTool="/tool/executive">
      <PageHeader
        title="Executive AI Decision Engine"
        description="AI-driven recommendations, scenario simulations, and executive dashboards"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.slice(0, 4).map((kpi) => {
          const change = kpi.previousValue
            ? (((kpi.value - kpi.previousValue) / kpi.previousValue) * 100).toFixed(1)
            : null;
          return (
            <div key={kpi.id} className="bg-white/5 rounded-xl border border-white/10 p-5">
              <div className="text-white/50 text-sm mb-2">{kpi.name}</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">
                  {kpi.unit === "KES" || kpi.unit === "USD/month"
                    ? `${kpi.value.toLocaleString()}`
                    : kpi.value.toLocaleString()}
                </span>
                {kpi.unit && (
                  <span className="text-white/40 text-xs mb-1">{kpi.unit}</span>
                )}
              </div>
              {change && (
                <div className={`text-xs mt-1 ${parseFloat(change) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {parseFloat(change) >= 0 ? "↑" : "↓"} {Math.abs(parseFloat(change))}% vs last period
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.slice(4).map((kpi) => {
          const change = kpi.previousValue
            ? (((kpi.value - kpi.previousValue) / kpi.previousValue) * 100).toFixed(1)
            : null;
          return (
            <div key={kpi.id} className="bg-white/5 rounded-xl border border-white/10 p-5">
              <div className="text-white/50 text-sm mb-2">{kpi.name}</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">
                  {typeof kpi.value === "number" && kpi.value >= 1000
                    ? kpi.value.toLocaleString()
                    : kpi.value}
                </span>
                {kpi.unit && (
                  <span className="text-white/40 text-xs mb-1">{kpi.unit}</span>
                )}
              </div>
              {change && (
                <div className={`text-xs mt-1 ${parseFloat(change) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {parseFloat(change) >= 0 ? "↑" : "↓"} {Math.abs(parseFloat(change))}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">
            AI Recommendations
            <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
              {pendingRecs.length} pending
            </span>
          </h3>
          <div className="space-y-3">
            {recommendations.map((r) => (
              <div key={r.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{r.title}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.category === "cost" ? "bg-amber-500/20 text-amber-300" : r.category === "risk" ? "bg-red-500/20 text-red-300" : r.category === "revenue" ? "bg-emerald-500/20 text-emerald-300" : "bg-blue-500/20 text-blue-300"}`}>
                      {r.category}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
                <p className="text-white/50 text-xs mb-2">{r.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>Confidence: <span className="text-white/70 font-mono">{r.confidence ? `${(r.confidence * 100).toFixed(0)}%` : "—"}</span></span>
                  <span>Impact: <span className={`font-mono ${r.impact === "high" ? "text-red-300" : "text-yellow-300"}`}>{r.impact}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Scenario Simulations</h3>
            <div className="space-y-3">
              {scenarios.map((s) => {
                const outcome = s.predictedOutcome ? JSON.parse(s.predictedOutcome) : {};
                return (
                  <div key={s.id} className="bg-white/5 rounded-lg p-4">
                    <div className="text-white font-medium text-sm mb-1">{s.name}</div>
                    <p className="text-white/40 text-xs mb-3">{s.description}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(outcome).map(([key, val]) => (
                        <div key={key} className="text-center bg-white/5 rounded p-2">
                          <div className="text-white/80 text-sm font-mono font-bold">
                            {typeof val === "number" ? val.toLocaleString() : String(val)}
                          </div>
                          <div className="text-white/40 text-xs">{key.replace(/_/g, " ")}</div>
                        </div>
                      ))}
                    </div>
                    {s.confidence && (
                      <div className="text-xs text-white/40 mt-2">
                        Confidence: {(s.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">Executive Alerts</h3>
        <DataTable headers={["Title", "Message", "Severity", "Source", "Status"]}>
          {alerts.map((a) => (
            <tr key={a.id} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white/80 text-sm font-medium">{a.title}</td>
              <td className="px-4 py-3 text-white/60 text-sm max-w-xs truncate">{a.message}</td>
              <td className="px-4 py-3"><SeverityBadge severity={a.severity} /></td>
              <td className="px-4 py-3 text-white/50 text-sm font-mono">{a.source || "—"}</td>
              <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
            </tr>
          ))}
        </DataTable>
      </div>
    </ToolLayout>
  );
}
