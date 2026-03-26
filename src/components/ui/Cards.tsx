import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "stable";
  color?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "blue",
}: StatCardProps) {
  const trendIcon =
    trend === "up" ? "↑" : trend === "down" ? "↓" : trend === "stable" ? "→" : "";

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-5 hover:bg-white/8 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className="text-white/50 text-sm font-medium">{title}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center text-${color}-400`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold text-${color}-400`}>{value}</span>
        {trend && (
          <span
            className={`text-sm mb-1 ${
              trend === "up"
                ? "text-emerald-400"
                : trend === "down"
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {trendIcon}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-white/40 text-xs mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-500/20",
    success: "text-emerald-400 bg-emerald-500/20",
    resolved: "text-emerald-400 bg-emerald-500/20",
    pass: "text-emerald-400 bg-emerald-500/20",
    running: "text-blue-400 bg-blue-500/20",
    investigating: "text-blue-400 bg-blue-500/20",
    pending: "text-blue-400 bg-blue-500/20",
    open: "text-yellow-400 bg-yellow-500/20",
    failed: "text-red-400 bg-red-500/20",
    error: "text-red-400 bg-red-500/20",
    critical: "text-red-400 bg-red-500/20",
    inactive: "text-gray-400 bg-gray-500/20",
    draft: "text-gray-400 bg-gray-500/20",
    paused: "text-gray-400 bg-gray-500/20",
    deprecated: "text-gray-400 bg-gray-500/20",
    degraded: "text-orange-400 bg-orange-500/20",
    warning: "text-yellow-400 bg-yellow-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || "text-gray-400 bg-gray-500/20"
      }`}
    >
      {status}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: string;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const colors: Record<string, string> = {
    critical: "text-red-400 bg-red-500/20 border-red-500/30",
    high: "text-orange-400 bg-orange-500/20 border-orange-500/30",
    medium: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
    low: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        colors[severity] || "text-gray-400 bg-gray-500/20 border-gray-500/30"
      }`}
    >
      {severity}
    </span>
  );
}

interface DataTableProps {
  headers: string[];
  children: ReactNode;
}

export function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-white/50">{description}</p>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <p className="text-white/40">{message}</p>
    </div>
  );
}
