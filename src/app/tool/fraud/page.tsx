"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, SeverityBadge, DataTable, PageHeader } from "@/components/ui/Cards";

interface Transaction {
  id: number;
  transactionRef: string;
  amount: number;
  channel: string;
  location: string;
  riskScore: number;
  isFraud: boolean;
  detectionMethod: string;
}

interface FraudRule {
  id: number;
  name: string;
  description: string;
  severity: string;
  isActive: boolean;
  triggeredCount: number;
}

interface FraudAlert {
  id: number;
  transactionId: number | null;
  alertType: string;
  severity: string;
  status: string;
  assignedTo: string | null;
}

interface Stats {
  totalTransactions: number;
  fraudDetected: number;
  avgRiskScore: number;
}

export default function FraudPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rules, setRules] = useState<FraudRule[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fraud")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setTransactions(d.data.transactions || []);
          setRules(d.data.rules || []);
          setAlerts(d.data.alerts || []);
          setStats(d.data.stats || null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/fraud">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/fraud">
      <PageHeader
        title="Fraud & Risk Analytics"
        description="Real-time fraud detection with rules, ML, and graph analytics"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Transactions" value={stats?.totalTransactions || 0} color="blue" />
        <StatCard title="Fraud Detected" value={stats?.fraudDetected || 0} color="red" />
        <StatCard title="Avg Risk Score" value={stats?.avgRiskScore?.toFixed(1) || "0"} color="orange" />
        <StatCard title="Open Alerts" value={alerts.filter((a) => a.status === "open").length} color={alerts.filter((a) => a.status === "open").length > 0 ? "red" : "emerald"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Recent Transactions</h3>
          <DataTable headers={["Ref", "Amount", "Channel", "Location", "Risk", "Status"]}>
            {transactions.slice(0, 10).map((t) => (
              <tr key={t.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/80 text-sm font-mono">{t.transactionRef}</td>
                <td className="px-4 py-3 text-white/80 text-sm font-mono">{t.amount.toLocaleString()} KES</td>
                <td className="px-4 py-3 text-white/60 text-sm">{t.channel}</td>
                <td className="px-4 py-3 text-white/60 text-sm">{t.location}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-mono ${t.riskScore > 70 ? "text-red-400" : t.riskScore > 40 ? "text-yellow-400" : "text-emerald-400"}`}>
                    {t.riskScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {t.isFraud ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Fraud</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Clean</span>
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Fraud Rules</h3>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">{rule.name}</span>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={rule.severity} />
                    <StatusBadge status={rule.isActive ? "active" : "inactive"} />
                  </div>
                </div>
                <p className="text-white/40 text-xs mb-2">{rule.description}</p>
                <div className="text-white/50 text-xs">
                  Triggered: <span className="text-white font-mono">{rule.triggeredCount}</span> times
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">Active Alerts</h3>
        <DataTable headers={["Alert Type", "Severity", "Status", "Assigned To"]}>
          {alerts.map((a) => (
            <tr key={a.id} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white/80 text-sm">{a.alertType.replace("_", " ")}</td>
              <td className="px-4 py-3"><SeverityBadge severity={a.severity} /></td>
              <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
              <td className="px-4 py-3 text-white/60 text-sm">{a.assignedTo || "Unassigned"}</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </ToolLayout>
  );
}
