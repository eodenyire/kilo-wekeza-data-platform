"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, DataTable, PageHeader } from "@/components/ui/Cards";

interface Asset {
  id: number;
  name: string;
  type: string;
  source: string;
  rowCount: number;
  status: string;
}

interface Edge {
  id: number;
  sourceId: number;
  targetId: number;
  transformationType: string | null;
}

interface PipelineRun {
  id: number;
  pipelineName: string;
  status: string;
  rowsProcessed: number;
  errorMessage: string | null;
}

interface Metric {
  id: number;
  assetId: number;
  metricType: string;
  value: number;
  threshold: number | null;
  status: string;
}

export default function LineagePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lineage")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setAssets(d.data.assets || []);
          setEdges(d.data.edges || []);
          setRuns(d.data.recentRuns || []);
          setMetrics(d.data.metrics || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/lineage">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/lineage">
      <PageHeader
        title="Data Lineage & Observability"
        description="End-to-end visibility of data movement across systems"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Data Assets" value={assets.length} color="blue" />
        <StatCard title="Lineage Edges" value={edges.length} color="cyan" />
        <StatCard
          title="Pipeline Failures"
          value={runs.filter((r) => r.status === "failed").length}
          color={runs.filter((r) => r.status === "failed").length > 0 ? "red" : "emerald"}
        />
        <StatCard
          title="Active Assets"
          value={assets.filter((a) => a.status === "active").length}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Data Assets</h3>
          <DataTable headers={["Name", "Type", "Source", "Rows", "Status"]}>
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/80 text-sm font-medium">
                  {asset.name}
                </td>
                <td className="px-4 py-3 text-white/60 text-sm">{asset.type}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/70">
                    {asset.source}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">
                  {asset.rowCount?.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={asset.status} />
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Lineage Graph</h3>
          <div className="space-y-3">
            {edges.map((edge) => {
              const source = assets.find((a) => a.id === edge.sourceId);
              const target = assets.find((a) => a.id === edge.targetId);
              return (
                <div
                  key={edge.id}
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
                >
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-mono">
                    {source?.name || `#${edge.sourceId}`}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/20" />
                    <span className="text-white/40 text-xs">
                      {edge.transformationType || "→"}
                    </span>
                    <div className="h-px flex-1 bg-white/20" />
                  </div>
                  <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg text-sm font-mono">
                    {target?.name || `#${edge.targetId}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Recent Pipeline Runs</h3>
          <DataTable headers={["Pipeline", "Status", "Rows Processed"]}>
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/80 text-sm">
                  {run.pipelineName}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={run.status} />
                </td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">
                  {run.rowsProcessed?.toLocaleString()}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Observability Metrics</h3>
          <DataTable headers={["Asset", "Metric", "Value", "Status"]}>
            {metrics.map((m) => {
              const asset = assets.find((a) => a.id === m.assetId);
              return (
                <tr key={m.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white/80 text-sm">
                    {asset?.name || `#${m.assetId}`}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-sm">{m.metricType}</td>
                  <td className="px-4 py-3 text-white/60 text-sm font-mono">
                    {typeof m.value === "number" ? m.value.toFixed(2) : m.value}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                </tr>
              );
            })}
          </DataTable>
        </div>
      </div>
    </ToolLayout>
  );
}
