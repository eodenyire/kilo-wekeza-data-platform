"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, SeverityBadge } from "@/components/ui/Cards";

interface DashboardData {
  lineage: { assetCount: number; edgeCount: number; pipelineFailures: number };
  quality: { avgTrustScore: number; incidents: number };
  fraud: { openAlerts: number; fraudDetected: number };
  drift: { openDrifts: number; modelsTracked: number };
  executive: { pendingRecommendations: number; criticalAlerts: number };
  contracts: { activeContracts: number; violations: number };
  optimizer: { pendingSuggestions: number; appliedSuggestions: number };
  pipelines: { activePipelines: number; recentExecutions: number };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [lineage, quality, fraud, drift, executive, contracts, optimizer, pipeline] =
          await Promise.all([
            fetch("/api/lineage").then((r) => r.json()),
            fetch("/api/quality").then((r) => r.json()),
            fetch("/api/fraud").then((r) => r.json()),
            fetch("/api/drift").then((r) => r.json()),
            fetch("/api/executive").then((r) => r.json()),
            fetch("/api/contracts").then((r) => r.json()),
            fetch("/api/optimizer").then((r) => r.json()),
            fetch("/api/pipeline").then((r) => r.json()),
          ]);

        const trustScores = quality.data?.scores || [];
        const avgTrust =
          trustScores.length > 0
            ? Math.round(
                trustScores.reduce(
                  (acc: number, s: { overallScore: number }) =>
                    acc + s.overallScore,
                  0
                ) / trustScores.length
              )
            : 0;

        setData({
          lineage: {
            assetCount: lineage.data?.assets?.length || 0,
            edgeCount: lineage.data?.edges?.length || 0,
            pipelineFailures:
              lineage.data?.recentRuns?.filter(
                (r: { status: string }) => r.status === "failed"
              ).length || 0,
          },
          quality: {
            avgTrustScore: avgTrust,
            incidents:
              quality.data?.incidents?.filter(
                (i: { status: string }) => i.status !== "resolved"
              ).length || 0,
          },
          fraud: {
            openAlerts:
              fraud.data?.alerts?.filter(
                (a: { status: string }) => a.status === "open"
              ).length || 0,
            fraudDetected: fraud.data?.stats?.fraudDetected || 0,
          },
          drift: {
            openDrifts:
              drift.data?.drifts?.filter(
                (d: { status: string }) => d.status === "open"
              ).length || 0,
            modelsTracked: drift.data?.models?.length || 0,
          },
          executive: {
            pendingRecommendations:
              executive.data?.recommendations?.filter(
                (r: { status: string }) => r.status === "pending"
              ).length || 0,
            criticalAlerts:
              executive.data?.alerts?.filter(
                (a: { severity: string }) => a.severity === "critical"
              ).length || 0,
          },
          contracts: {
            activeContracts:
              contracts.data?.contracts?.filter(
                (c: { status: string }) => c.status === "active"
              ).length || 0,
            violations:
              contracts.data?.validations?.filter(
                (v: { status: string }) => v.status === "fail"
              ).length || 0,
          },
          optimizer: {
            pendingSuggestions:
              optimizer.data?.suggestions?.filter(
                (s: { status: string }) => s.status === "pending"
              ).length || 0,
            appliedSuggestions:
              optimizer.data?.suggestions?.filter(
                (s: { status: string }) => s.status === "applied"
              ).length || 0,
          },
          pipelines: {
            activePipelines:
              pipeline.data?.pipelines?.filter(
                (p: { status: string }) => p.status === "active"
              ).length || 0,
            recentExecutions: pipeline.data?.executions?.length || 0,
          },
        });
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <ToolLayout currentTool="/dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-white/50">Loading dashboard...</div>
        </div>
      </ToolLayout>
    );
  }

  const tools = [
    {
      href: "/tool/lineage",
      name: "Data Lineage & Observability",
      icon: "🔗",
      stats: data
        ? [
            {
              label: "Data Assets",
              value: data.lineage.assetCount,
              color: "text-blue-400",
            },
            {
              label: "Lineage Edges",
              value: data.lineage.edgeCount,
              color: "text-cyan-400",
            },
            {
              label: "Pipeline Failures",
              value: data.lineage.pipelineFailures,
              color:
                data.lineage.pipelineFailures > 0
                  ? "text-red-400"
                  : "text-emerald-400",
            },
          ]
        : [],
    },
    {
      href: "/tool/quality",
      name: "Data Quality & Trust",
      icon: "📊",
      stats: data
        ? [
            {
              label: "Avg Trust Score",
              value: `${data.quality.avgTrustScore}/100`,
              color:
                data.quality.avgTrustScore >= 80
                  ? "text-emerald-400"
                  : "text-yellow-400",
            },
            {
              label: "Open Incidents",
              value: data.quality.incidents,
              color:
                data.quality.incidents > 0
                  ? "text-orange-400"
                  : "text-emerald-400",
            },
          ]
        : [],
    },
    {
      href: "/tool/fraud",
      name: "Fraud & Risk Analytics",
      icon: "🔍",
      stats: data
        ? [
            {
              label: "Open Alerts",
              value: data.fraud.openAlerts,
              color:
                data.fraud.openAlerts > 0
                  ? "text-red-400"
                  : "text-emerald-400",
            },
            {
              label: "Fraud Detected",
              value: data.fraud.fraudDetected,
              color: "text-orange-400",
            },
          ]
        : [],
    },
    {
      href: "/tool/drift",
      name: "ML Drift Monitor",
      icon: "📡",
      stats: data
        ? [
            {
              label: "Models Tracked",
              value: data.drift.modelsTracked,
              color: "text-blue-400",
            },
            {
              label: "Open Drifts",
              value: data.drift.openDrifts,
              color:
                data.drift.openDrifts > 0
                  ? "text-red-400"
                  : "text-emerald-400",
            },
          ]
        : [],
    },
    {
      href: "/tool/executive",
      name: "Executive AI",
      icon: "🧠",
      stats: data
        ? [
            {
              label: "Recommendations",
              value: data.executive.pendingRecommendations,
              color: "text-purple-400",
            },
            {
              label: "Critical Alerts",
              value: data.executive.criticalAlerts,
              color:
                data.executive.criticalAlerts > 0
                  ? "text-red-400"
                  : "text-emerald-400",
            },
          ]
        : [],
    },
    {
      href: "/tool/contracts",
      name: "Data Contracts",
      icon: "📋",
      stats: data
        ? [
            {
              label: "Active Contracts",
              value: data.contracts.activeContracts,
              color: "text-blue-400",
            },
            {
              label: "Violations",
              value: data.contracts.violations,
              color:
                data.contracts.violations > 0
                  ? "text-red-400"
                  : "text-emerald-400",
            },
          ]
        : [],
    },
    {
      href: "/tool/optimizer",
      name: "Pipeline Optimizer",
      icon: "⚡",
      stats: data
        ? [
            {
              label: "Applied",
              value: data.optimizer.appliedSuggestions,
              color: "text-emerald-400",
            },
            {
              label: "Pending",
              value: data.optimizer.pendingSuggestions,
              color: "text-yellow-400",
            },
          ]
        : [],
    },
    {
      href: "/tool/pipeline",
      name: "Data Pipelines",
      icon: "⚙️",
      stats: data
        ? [
            {
              label: "Active Pipelines",
              value: data.pipelines.activePipelines,
              color: "text-blue-400",
            },
            {
              label: "Recent Runs",
              value: data.pipelines.recentExecutions,
              color: "text-cyan-400",
            },
          ]
        : [],
    },
  ];

  return (
    <ToolLayout currentTool="/dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Wekeza Data Platform
          </h1>
          <p className="text-white/50">
            Unified view of all 10 data intelligence tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-white/5 rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{tool.icon}</span>
                <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
              </div>
              <div className="space-y-2">
                {tool.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white/40 text-xs">{stat.label}</span>
                    <span className={`${stat.color} font-mono text-sm`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Quick Access</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/tool/nlq", label: "Query in English", icon: "💬" },
                { href: "/tool/federated", label: "Federated Query", icon: "🌐" },
                { href: "/tool/lineage", label: "View Lineage", icon: "🔗" },
                { href: "/tool/fraud", label: "Fraud Dashboard", icon: "🔍" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="text-white font-semibold mb-4">Platform Health</h3>
            <div className="space-y-3">
              {[
                {
                  label: "Data Quality",
                  score: data?.quality.avgTrustScore || 0,
                },
                {
                  label: "Pipeline Health",
                  score: data?.pipelines.activePipelines ? 95 : 0,
                },
                {
                  label: "ML Model Health",
                  score: data?.drift.openDrifts === 0 ? 98 : 72,
                },
                {
                  label: "Contract Compliance",
                  score: data?.contracts.violations === 0 ? 100 : 85,
                },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">{item.label}</span>
                    <span
                      className={`font-mono ${
                        item.score >= 90
                          ? "text-emerald-400"
                          : item.score >= 70
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.score >= 90
                          ? "bg-emerald-500"
                          : item.score >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
