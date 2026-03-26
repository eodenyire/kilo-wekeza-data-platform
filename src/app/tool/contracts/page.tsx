"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, StatusBadge, DataTable, PageHeader } from "@/components/ui/Cards";

interface Contract {
  id: number;
  name: string;
  datasetName: string;
  version: string;
  owner: string | null;
  status: string;
  sla: string | null;
}

interface Validation {
  id: number;
  contractId: number;
  status: string;
  violations: string;
}

interface Alert {
  id: number;
  contractId: number;
  alertType: string;
  message: string;
  channel: string | null;
  status: string;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [validations, setValidations] = useState<Validation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contracts")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setContracts(d.data.contracts || []);
          setValidations(d.data.validations || []);
          setAlerts(d.data.alerts || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/contracts">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  const passRate = validations.length > 0
    ? Math.round((validations.filter((v) => v.status === "pass").length / validations.length) * 100)
    : 100;

  return (
    <ToolLayout currentTool="/tool/contracts">
      <PageHeader
        title="Data Contract Enforcement"
        description="CI/CD for data contracts — enforce schemas, SLAs, and constraints"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Active Contracts" value={contracts.filter((c) => c.status === "active").length} color="blue" />
        <StatCard title="Pass Rate" value={`${passRate}%`} color={passRate >= 90 ? "emerald" : "yellow"} />
        <StatCard title="Violations" value={validations.filter((v) => v.status === "fail").length} color="red" />
        <StatCard title="Total Alerts" value={alerts.length} color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Active Contracts</h3>
          <div className="space-y-4">
            {contracts.map((c) => {
              const sla = c.sla ? JSON.parse(c.sla) : null;
              return (
                <div key={c.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/50">{c.version}</span>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/50 mb-2">
                    <span>Dataset: <span className="text-white/70 font-mono">{c.datasetName}</span></span>
                    <span>Owner: <span className="text-white/70">{c.owner || "—"}</span></span>
                  </div>
                  {sla && (
                    <div className="flex gap-2 mt-2">
                      {Object.entries(sla).map(([key, val]) => (
                        <span key={key} className="text-xs bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded">
                          {key}: {String(val)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-4">Validation Results</h3>
          <DataTable headers={["Contract", "Status", "Violations"]}>
            {validations.map((v) => {
              const contract = contracts.find((c) => c.id === v.contractId);
              const violations = JSON.parse(v.violations || "[]");
              return (
                <tr key={v.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white/80 text-sm">{contract?.name || `#${v.contractId}`}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 text-white/60 text-sm">
                    {violations.length > 0 ? (
                      <span className="text-red-400">{violations.length} violation(s)</span>
                    ) : (
                      <span className="text-emerald-400">No violations</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </DataTable>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">Contract Alerts</h3>
        <DataTable headers={["Contract", "Type", "Message", "Channel", "Status"]}>
          {alerts.map((a) => {
            const contract = contracts.find((c) => c.id === a.contractId);
            return (
              <tr key={a.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white/80 text-sm">{contract?.name || `#${a.contractId}`}</td>
                <td className="px-4 py-3 text-white/60 text-sm">{a.alertType.replace("_", " ")}</td>
                <td className="px-4 py-3 text-white/60 text-sm max-w-xs truncate">{a.message}</td>
                <td className="px-4 py-3 text-white/50 text-sm font-mono">{a.channel || "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
              </tr>
            );
          })}
        </DataTable>
      </div>
    </ToolLayout>
  );
}
