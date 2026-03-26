export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  totalAssets: number;
  activePipelines: number;
  dataQualityScore: number;
  fraudAlertsOpen: number;
  mlModelsMonitored: number;
  contractsActive: number;
  optimizationsApplied: number;
  federatedQueriesRun: number;
  driftEventsOpen: number;
  recommendationsPending: number;
}

export type Severity = "low" | "medium" | "high" | "critical";
export type Status =
  | "active"
  | "inactive"
  | "error"
  | "running"
  | "success"
  | "failed"
  | "open"
  | "resolved"
  | "pending";

export interface LineageNode {
  id: number;
  name: string;
  type: string;
  source: string;
  status: string;
}

export interface LineageEdge {
  id: number;
  sourceId: number;
  targetId: number;
  transformationType: string | null;
}

export interface LineageGraph {
  nodes: LineageNode[];
  edges: LineageEdge[];
}

export interface TrustScoreBreakdown {
  overall: number;
  completeness: number;
  accuracy: number;
  consistency: number;
  freshness: number;
}

export interface DriftMetrics {
  featureName: string;
  pValue: number;
  magnitude: number;
  severity: string;
}

export interface KpiSummary {
  name: string;
  value: number;
  previousValue: number | null;
  unit: string | null;
  trend: string | null;
  changePercent: number | null;
}
