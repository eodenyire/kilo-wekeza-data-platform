import type { ApiResponse } from "./types";

export function successResponse<T>(data: T): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
  return Response.json(body);
}

export function errorResponse(error: string, status = 500): Response {
  const body: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
  return Response.json(body, { status });
}

export function formatDate(date: Date | number | null): string {
  if (!date) return "N/A";
  const d = typeof date === "number" ? new Date(date) : date;
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 50) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBg(score: number): string {
  if (score >= 90) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 70) return "bg-yellow-500/20 border-yellow-500/30";
  if (score >= 50) return "bg-orange-500/20 border-orange-500/30";
  return "bg-red-500/20 border-red-500/30";
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "text-red-400 bg-red-500/20";
    case "high":
      return "text-orange-400 bg-orange-500/20";
    case "medium":
      return "text-yellow-400 bg-yellow-500/20";
    default:
      return "text-blue-400 bg-blue-500/20";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
    case "success":
    case "resolved":
    case "pass":
      return "text-emerald-400 bg-emerald-500/20";
    case "running":
    case "investigating":
    case "pending":
      return "text-blue-400 bg-blue-500/20";
    case "failed":
    case "error":
    case "critical":
      return "text-red-400 bg-red-500/20";
    default:
      return "text-gray-400 bg-gray-500/20";
  }
}
