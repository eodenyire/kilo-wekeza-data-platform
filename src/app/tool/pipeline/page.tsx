"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, DataTable, PageHeader } from "@/components/ui/Cards";

interface Connector {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface Pipeline {
  id: number;
  name: string;
  description: string | null;
  schedule: string | null;
  status: string;
}

interface Execution {
  id: number;
  pipelineId: number;
  status: string;
  rowsIn: number;
  rowsOut: number;
  errorMessage: string | null;
}

export default function PipelinePage() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pipeline")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setConnectors(d.data.connectors || []);
          setPipelines(d.data.pipelines || []);
          setExecutions(d.data.executions || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/pipeline">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/pipeline">
      <PageHeader
        title="Data Integration Platform"
        description="Build, orchestrate, and monitor data pipelines"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Connectors" value={connectors.length} color="blue" />
        <StatCard title="Active Pipelines" value={pipelines.filter((p) => p.status === "active").length} color="emerald" />
        <StatCard title="Total Executions" value={executions.length} color="cyan" />
        <StatCard title="Failed Runs" value={executions.filter((e) => e.status === "failed").length} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Data Connectors</h3>
          <div className="space-y-3">
            {connectors.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                    {c.type.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{c.name}</div>
                    <div className="text-white/40 text-xs font-mono">{c.type}</div>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Pipelines</h3>
          <div className="space-y-3">
            {pipelines.map((p) => (
              <div key={p.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{p.name}</span>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-white/40 text-xs mb-2">{p.description}</p>
                {p.schedule && (
                  <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/50">
                    {p.schedule}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">Recent Executions</h3>
        <DataTable headers={["Pipeline ID", "Status", "Rows In", "Rows Out", "Error"]}>
          {executions.map((e) => {
            const pipeline = pipelines.find((p) => p.id === e.pipelineId);
            return (
              <tr key={e.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/80 text-sm">
                  {pipeline?.name || `Pipeline #${e.pipelineId}`}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">
                  {e.rowsIn?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">
                  {e.rowsOut?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-red-400/70 text-xs max-w-xs truncate">
                  {e.errorMessage || "—"}
                </td>
              </tr>
            );
          })}
        </DataTable>
      </div>
    </ToolLayout>
  );
}
