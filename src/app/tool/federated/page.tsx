"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, DataTable, PageHeader } from "@/components/ui/Cards";

interface VirtualSchema {
  id: number;
  name: string;
  sourceConnectorId: number;
  remoteTable: string;
}

interface FederatedQuery {
  id: number;
  queryText: string;
  sourcesUsed: string;
  executionTime: number | null;
  rowsReturned: number | null;
  cached: boolean;
}

export default function FederatedPage() {
  const [schemas, setSchemas] = useState<VirtualSchema[]>([]);
  const [queries, setQueries] = useState<FederatedQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryInput, setQueryInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/federated")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSchemas(d.data.schemas || []);
          setQueries(d.data.queries || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExecute = async () => {
    if (!queryInput.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/federated", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryText: queryInput, sources: ["postgres"] }),
      });
      const d = await res.json();
      if (d.success) {
        setQueries((prev) => [d.data, ...prev]);
        setQueryInput("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/federated">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/federated">
      <PageHeader
        title="Federated Query Engine"
        description="Query multiple data sources with a single SQL — no data movement required"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Virtual Schemas" value={schemas.length} color="blue" />
        <StatCard title="Queries Executed" value={queries.length} color="cyan" />
        <StatCard title="Cached Results" value={queries.filter((q) => q.cached).length} color="emerald" />
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
        <h3 className="text-white font-semibold mb-4">Execute Federated Query</h3>
        <textarea
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder={`SELECT c.name, t.amount\nFROM v_customers c\nJOIN v_transactions t ON c.id = t.customer_id\nWHERE t.amount > 100000`}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 font-mono text-sm h-24 resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {["v_customers", "v_transactions", "v_fraud_events"].map((s) => (
              <span key={s} className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-white/50 cursor-pointer hover:bg-white/20" onClick={() => setQueryInput((prev) => prev + s)}>
                {s}
              </span>
            ))}
          </div>
          <button
            onClick={handleExecute}
            disabled={submitting || !queryInput.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all"
          >
            {submitting ? "Executing..." : "Execute Query"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Virtual Schema Layer</h3>
          <div className="space-y-3">
            {schemas.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div>
                  <div className="text-white text-sm font-mono font-medium">{s.name}</div>
                  <div className="text-white/40 text-xs">Source: Connector #{s.sourceConnectorId} | Table: {s.remoteTable}</div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">mapped</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Query History</h3>
          <DataTable headers={["Query", "Sources", "Time", "Rows", "Cached"]}>
            {queries.map((q) => {
              const sources = JSON.parse(q.sourcesUsed || "[]");
              return (
                <tr key={q.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white/80 text-xs font-mono max-w-xs truncate">{q.queryText}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {sources.map((s: string) => (
                        <span key={s} className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/50">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-sm font-mono">{q.executionTime?.toFixed(2)}s</td>
                  <td className="px-4 py-3 text-white/60 text-sm font-mono">{q.rowsReturned?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {q.cached ? (
                      <span className="text-xs text-emerald-400">✓</span>
                    ) : (
                      <span className="text-xs text-white/30">—</span>
                    )}
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
