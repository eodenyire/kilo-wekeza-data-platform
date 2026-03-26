"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, DataTable, PageHeader } from "@/components/ui/Cards";

interface PipelineMetric {
  id: number;
  pipelineId: number;
  executionTime: number | null;
  cpuUsage: number | null;
  memoryUsage: number | null;
  rowsProcessed: number;
  costEstimate: number;
}

interface Suggestion {
  id: number;
  pipelineId: number;
  type: string;
  description: string;
  currentPerformance: string | null;
  expectedImprovement: string | null;
  impact: string;
  status: string;
}

interface QueryProfile {
  id: number;
  queryText: string;
  executionTime: number | null;
  cost: number | null;
  rowsReturned: number | null;
}

export default function OptimizerPage() {
  const [metrics, setMetrics] = useState<PipelineMetric[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [profiles, setProfiles] = useState<QueryProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/optimizer")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setMetrics(d.data.metrics || []);
          setSuggestions(d.data.suggestions || []);
          setProfiles(d.data.profiles || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalCost = metrics.reduce((a, m) => a + (m.costEstimate || 0), 0);
  const appliedCount = suggestions.filter((s) => s.status === "applied").length;
  const pendingCount = suggestions.filter((s) => s.status === "pending").length;

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/optimizer">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/optimizer">
      <PageHeader
        title="Pipeline Optimizer"
        description="AI-driven pipeline performance analysis and auto-optimization"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Cost" value={`$${totalCost.toFixed(2)}`} color="orange" />
        <StatCard title="Optimizations Applied" value={appliedCount} color="emerald" />
        <StatCard title="Pending Suggestions" value={pendingCount} color="yellow" />
        <StatCard title="Queries Profiled" value={profiles.length} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Pipeline Performance</h3>
          <DataTable headers={["Pipeline", "Exec Time", "CPU %", "Memory %", "Cost"]}>
            {metrics.map((m) => (
              <tr key={m.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/80 text-sm">Pipeline #{m.pipelineId}</td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">{m.executionTime?.toFixed(1)}s</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full">
                      <div className={`h-full rounded-full ${(m.cpuUsage || 0) > 80 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${m.cpuUsage}%` }} />
                    </div>
                    <span className="text-white/60 text-xs font-mono">{m.cpuUsage}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full">
                      <div className={`h-full rounded-full ${(m.memoryUsage || 0) > 60 ? "bg-yellow-500" : "bg-emerald-500"}`} style={{ width: `${m.memoryUsage}%` }} />
                    </div>
                    <span className="text-white/60 text-xs font-mono">{m.memoryUsage}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">${m.costEstimate?.toFixed(2)}</td>
              </tr>
            ))}
          </DataTable>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Query Profiles</h3>
          <DataTable headers={["Query", "Time", "Cost", "Rows"]}>
            {profiles.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/80 text-xs font-mono max-w-xs truncate">{p.queryText}</td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">{p.executionTime?.toFixed(2)}s</td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">${p.cost?.toFixed(2)}</td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">{p.rowsReturned?.toLocaleString()}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">Optimization Suggestions</h3>
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.type === "indexing" ? "bg-blue-500/20 text-blue-300" : s.type === "partitioning" ? "bg-purple-500/20 text-purple-300" : s.type === "caching" ? "bg-cyan-500/20 text-cyan-300" : "bg-amber-500/20 text-amber-300"}`}>
                    {s.type}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.impact === "high" ? "bg-red-500/20 text-red-300" : s.impact === "medium" ? "bg-yellow-500/20 text-yellow-300" : "bg-gray-500/20 text-gray-300"}`}>
                    {s.impact} impact
                  </span>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-white/80 text-sm mb-2">{s.description}</p>
              <div className="flex gap-4 text-xs text-white/40">
                <span>Current: {s.currentPerformance}</span>
                <span className="text-emerald-400/70">Expected: {s.expectedImprovement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
