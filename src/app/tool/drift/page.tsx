"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, SeverityBadge, DataTable, PageHeader } from "@/components/ui/Cards";

interface MLModel {
  id: number;
  name: string;
  version: string;
  type: string;
  status: string;
}

interface ModelPerformance {
  id: number;
  modelId: number;
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
  aucRoc: number | null;
}

interface DriftEvent {
  id: number;
  modelId: number;
  driftType: string;
  featureName: string | null;
  pValue: number | null;
  driftMagnitude: number | null;
  severity: string;
  status: string;
}

export default function DriftPage() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [performance, setPerformance] = useState<ModelPerformance[]>([]);
  const [drifts, setDrifts] = useState<DriftEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/drift")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setModels(d.data.models || []);
          setPerformance(d.data.performance || []);
          setDrifts(d.data.drifts || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getLatestPerformance = (modelId: number) => {
    return performance.find((p) => p.modelId === modelId);
  };

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/drift">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/drift">
      <PageHeader
        title="Data Drift & Model Monitoring"
        description="Monitor ML models for drift, degradation, and performance anomalies"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Models Tracked" value={models.length} color="blue" />
        <StatCard title="Open Drifts" value={drifts.filter((d) => d.status === "open").length} color={drifts.filter((d) => d.status === "open").length > 0 ? "red" : "emerald"} />
        <StatCard title="Critical Drifts" value={drifts.filter((d) => d.severity === "critical").length} color="red" />
        <StatCard title="Degraded Models" value={models.filter((m) => m.status === "degraded").length} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Model Health</h3>
          <div className="space-y-4">
            {models.map((model) => {
              const perf = getLatestPerformance(model.id);
              return (
                <div key={model.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-white font-medium">{model.name}</span>
                      <span className="text-white/40 text-xs ml-2">{model.version}</span>
                    </div>
                    <StatusBadge status={model.status} />
                  </div>
                  {perf && (
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: "Accuracy", value: perf.accuracy },
                        { label: "Precision", value: perf.precision },
                        { label: "Recall", value: perf.recall },
                        { label: "F1", value: perf.f1Score },
                        { label: "AUC", value: perf.aucRoc },
                      ].map((m) => (
                        <div key={m.label} className="text-center">
                          <div className={`text-sm font-mono font-bold ${(m.value || 0) >= 0.9 ? "text-emerald-400" : (m.value || 0) >= 0.75 ? "text-yellow-400" : "text-red-400"}`}>
                            {m.value ? (m.value * 100).toFixed(1) : "—"}%
                          </div>
                          <div className="text-white/40 text-xs">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Drift Detection</h3>
          <DataTable headers={["Model", "Type", "Feature", "p-value", "Magnitude", "Severity", "Status"]}>
            {drifts.map((d) => {
              const model = models.find((m) => m.id === d.modelId);
              return (
                <tr key={d.id} className="hover:bg-white/5">
                  <td className="px-3 py-3 text-white/80 text-sm">{model?.name || `#${d.modelId}`}</td>
                  <td className="px-3 py-3 text-white/60 text-sm">{d.driftType}</td>
                  <td className="px-3 py-3 text-white/60 text-sm font-mono">{d.featureName || "—"}</td>
                  <td className="px-3 py-3">
                    <span className={`text-sm font-mono ${(d.pValue || 1) < 0.05 ? "text-red-400" : "text-emerald-400"}`}>
                      {d.pValue?.toFixed(4)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-white/60 text-sm font-mono">{d.driftMagnitude?.toFixed(2)}</td>
                  <td className="px-3 py-3"><SeverityBadge severity={d.severity} /></td>
                  <td className="px-3 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              );
            })}
          </DataTable>
        </div>
      </div>
    </ToolLayout>
  );
}
