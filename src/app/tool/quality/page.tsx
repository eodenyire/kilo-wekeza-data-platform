"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, DataTable, PageHeader } from "@/components/ui/Cards";

interface QualityRule {
  id: number;
  name: string;
  datasetName: string;
  ruleType: string;
  threshold: number;
}

interface QualityResult {
  id: number;
  ruleId: number;
  datasetName: string;
  score: number;
  status: string;
}

interface TrustScore {
  id: number;
  datasetName: string;
  overallScore: number;
  completenessScore: number;
  accuracyScore: number;
  consistencyScore: number;
  freshnessScore: number;
}

interface Incident {
  id: number;
  title: string;
  datasetName: string;
  severity: string;
  status: string;
  rootCause: string | null;
}

export default function QualityPage() {
  const [rules, setRules] = useState<QualityRule[]>([]);
  const [results, setResults] = useState<QualityResult[]>([]);
  const [scores, setScores] = useState<TrustScore[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quality")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setRules(d.data.rules || []);
          setResults(d.data.results || []);
          setScores(d.data.scores || []);
          setIncidents(d.data.incidents || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, s) => a + s.overallScore, 0) / scores.length)
      : 0;

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/quality">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/quality">
      <PageHeader
        title="Data Quality & Trust Scoring"
        description="Credit score for your data — measure completeness, accuracy, consistency, and freshness"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Avg Trust Score" value={`${avgScore}/100`} color={avgScore >= 80 ? "emerald" : "yellow"} />
        <StatCard title="Quality Rules" value={rules.length} color="blue" />
        <StatCard title="Datasets Monitored" value={scores.length} color="cyan" />
        <StatCard title="Open Incidents" value={incidents.filter((i) => i.status !== "resolved").length} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Trust Scores by Dataset</h3>
          <div className="space-y-4">
            {scores.map((s) => (
              <div key={s.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">{s.datasetName}</span>
                  <span className={`text-2xl font-bold ${s.overallScore >= 90 ? "text-emerald-400" : s.overallScore >= 70 ? "text-yellow-400" : "text-red-400"}`}>
                    {s.overallScore}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Complete", value: s.completenessScore },
                    { label: "Accurate", value: s.accuracyScore },
                    { label: "Consistent", value: s.consistencyScore },
                    { label: "Fresh", value: s.freshnessScore },
                  ].map((dim) => (
                    <div key={dim.label} className="text-center">
                      <div className="h-1.5 bg-white/10 rounded-full mb-1">
                        <div
                          className={`h-full rounded-full ${dim.value >= 90 ? "bg-emerald-500" : dim.value >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${dim.value}%` }}
                        />
                      </div>
                      <div className="text-white/40 text-xs">{dim.label}</div>
                      <div className="text-white/70 text-xs font-mono">{dim.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Quality Rule Results</h3>
          <DataTable headers={["Rule", "Dataset", "Score", "Status"]}>
            {results.map((r) => {
              const rule = rules.find((rl) => rl.id === r.ruleId);
              return (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white/80 text-sm">{rule?.name || `Rule #${r.ruleId}`}</td>
                  <td className="px-4 py-3 text-white/60 text-sm font-mono">{r.datasetName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono ${r.score >= 0.95 ? "text-emerald-400" : r.score >= 0.8 ? "text-yellow-400" : "text-red-400"}`}>
                      {(r.score * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              );
            })}
          </DataTable>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">Data Incidents</h3>
        <DataTable headers={["Title", "Dataset", "Severity", "Status", "Root Cause"]}>
          {incidents.map((i) => (
            <tr key={i.id} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white/80 text-sm">{i.title}</td>
              <td className="px-4 py-3 text-white/60 text-sm font-mono">{i.datasetName}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${i.severity === "critical" ? "bg-red-500/20 text-red-400" : i.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {i.severity}
                </span>
              </td>
              <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
              <td className="px-4 py-3 text-white/40 text-xs">{i.rootCause || "Under investigation"}</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </ToolLayout>
  );
}
