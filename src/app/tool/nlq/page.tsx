"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { DataTable, PageHeader } from "@/components/ui/Cards";

interface NLQQuery {
  id: number;
  naturalLanguage: string;
  generatedSql: string | null;
  chartType: string | null;
  executionTime: number | null;
  success: boolean | null;
  feedbackRating: number | null;
}

interface SemanticMapping {
  id: number;
  businessTerm: string;
  databaseTable: string;
  databaseColumn: string;
  description: string | null;
}

export default function NLQPage() {
  const [queries, setQueries] = useState<NLQQuery[]>([]);
  const [mappings, setMappings] = useState<SemanticMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<NLQQuery | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/nlq")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setQueries(d.data.queries || []);
          setMappings(d.data.mappings || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/nlq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "query", naturalLanguage: input }),
      });
      const d = await res.json();
      if (d.success) {
        setResult(d.data);
        setQueries((prev) => [d.data, ...prev]);
        setInput("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/nlq">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/nlq">
      <PageHeader
        title="Natural Language Query Engine"
        description="Ask questions in plain English, get SQL and insights instantly"
      />

      <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
        <h3 className="text-white font-semibold mb-4">Ask a Question</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Show me fraud trends in Nairobi last 6 months"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
          >
            {submitting ? "Generating..." : "Generate SQL"}
          </button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="text-emerald-400 text-xs font-mono mb-2">
                Generated SQL
              </div>
              <code className="text-white/80 text-sm font-mono block whitespace-pre-wrap">
                {result.generatedSql}
              </code>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/50">
              <span>Chart: {result.chartType}</span>
              <span>Execution: {result.executionTime?.toFixed(2)}s</span>
              <span
                className={
                  result.success ? "text-emerald-400" : "text-red-400"
                }
              >
                {result.success ? "Success" : "Failed"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Query History</h3>
          <DataTable
            headers={["Natural Language", "Chart", "Time", "Rating"]}
          >
            {queries.map((q) => (
              <tr key={q.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/80 text-sm max-w-xs truncate">
                  {q.naturalLanguage}
                </td>
                <td className="px-4 py-3 text-white/60 text-sm">
                  {q.chartType || "—"}
                </td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">
                  {q.executionTime?.toFixed(2)}s
                </td>
                <td className="px-4 py-3 text-white/60 text-sm">
                  {q.feedbackRating
                    ? "★".repeat(q.feedbackRating)
                    : "—"}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Semantic Layer</h3>
          <p className="text-white/40 text-sm mb-4">
            Business terms mapped to database schema
          </p>
          <DataTable headers={["Business Term", "Table", "Column", "Description"]}>
            {mappings.map((m) => (
              <tr key={m.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white font-medium text-sm">
                  {m.businessTerm}
                </td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">
                  {m.databaseTable}
                </td>
                <td className="px-4 py-3 text-white/60 text-sm font-mono">
                  {m.databaseColumn}
                </td>
                <td className="px-4 py-3 text-white/40 text-sm">
                  {m.description}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>
    </ToolLayout>
  );
}
