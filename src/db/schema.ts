import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ============================================================
// TOOL #1: Universal Data Lineage & Observability Engine
// ============================================================

export const dataAssets = sqliteTable("data_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(), // table, view, file, stream, api
  source: text("source").notNull(), // postgres, mongodb, kafka, etc.
  schema: text("schema"), // JSON schema definition
  rowCount: integer("row_count").default(0),
  lastScanAt: integer("last_scan_at", { mode: "timestamp" }),
  status: text("status").default("active"), // active, inactive, error
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const lineageEdges = sqliteTable("lineage_edges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceId: integer("source_id").notNull(),
  targetId: integer("target_id").notNull(),
  transformationType: text("transformation_type"), // copy, transform, aggregate
  columnMapping: text("column_mapping"), // JSON column-level mapping
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const pipelineRuns = sqliteTable("pipeline_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pipelineName: text("pipeline_name").notNull(),
  status: text("status").notNull(), // running, success, failed
  startTime: integer("start_time", { mode: "timestamp" }),
  endTime: integer("end_time", { mode: "timestamp" }),
  rowsProcessed: integer("rows_processed").default(0),
  errorMessage: text("error_message"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const observabilityMetrics = sqliteTable("observability_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assetId: integer("asset_id").notNull(),
  metricType: text("metric_type").notNull(), // freshness, volume, latency, error_rate
  value: real("value").notNull(),
  threshold: real("threshold"),
  status: text("status").default("ok"), // ok, warning, critical
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ============================================================
// TOOL #2: Natural Language → SQL + Insights Engine
// ============================================================

export const nlqQueries = sqliteTable("nlq_queries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  naturalLanguage: text("natural_language").notNull(),
  generatedSql: text("generated_sql"),
  resultSummary: text("result_summary"),
  insight: text("insight"), // LLM-generated insight
  chartType: text("chart_type"), // bar, line, pie, table
  executionTime: real("execution_time"),
  success: integer("success", { mode: "boolean" }).default(true),
  feedbackRating: integer("feedback_rating"), // 1-5
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const semanticMappings = sqliteTable("semantic_mappings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  businessTerm: text("business_term").notNull(),
  databaseTable: text("database_table").notNull(),
  databaseColumn: text("database_column").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const conversationHistory = sqliteTable("conversation_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(), // user, assistant
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ============================================================
// TOOL #3: Plug-and-Play Data Integration Platform
// ============================================================

export const connectors = sqliteTable("connectors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(), // postgres, mongodb, api, kafka, csv
  config: text("config"), // JSON connection config
  status: text("status").default("active"), // active, inactive, error
  lastSyncAt: integer("last_sync_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const pipelines = sqliteTable("pipelines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  sourceConnectorId: integer("source_connector_id"),
  targetConnectorId: integer("target_connector_id"),
  schedule: text("schedule"), // cron expression
  config: text("config"), // JSON pipeline config with nodes
  status: text("status").default("draft"), // draft, active, paused, error
  lastRunAt: integer("last_run_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const pipelineExecutions = sqliteTable("pipeline_executions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pipelineId: integer("pipeline_id").notNull(),
  status: text("status").notNull(), // running, success, failed
  startTime: integer("start_time", { mode: "timestamp" }),
  endTime: integer("end_time", { mode: "timestamp" }),
  rowsIn: integer("rows_in").default(0),
  rowsOut: integer("rows_out").default(0),
  errorMessage: text("error_message"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ============================================================
// TOOL #4: Real-Time Fraud & Risk Analytics Sandbox
// ============================================================

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  transactionRef: text("transaction_ref").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").default("KES"),
  sourceAccount: text("source_account"),
  targetAccount: text("target_account"),
  channel: text("channel"), // mobile, web, atm, branch
  location: text("location"),
  timestamp: integer("timestamp", { mode: "timestamp" }),
  riskScore: real("risk_score").default(0),
  isFraud: integer("is_fraud", { mode: "boolean" }).default(false),
  detectionMethod: text("detection_method"), // rule, ml, graph
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const fraudRules = sqliteTable("fraud_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  condition: text("condition").notNull(), // JSON rule definition
  severity: text("severity").default("medium"), // low, medium, high, critical
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  triggeredCount: integer("triggered_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const fraudAlerts = sqliteTable("fraud_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  transactionId: integer("transaction_id"),
  ruleId: integer("rule_id"),
  alertType: text("alert_type").notNull(), // rule, ml_anomaly, graph_pattern
  severity: text("severity").notNull(),
  status: text("status").default("open"), // open, investigating, resolved, false_positive
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const riskSimulations = sqliteTable("risk_simulations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  parameters: text("parameters").notNull(), // JSON simulation params
  results: text("results"), // JSON simulation results
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ============================================================
// TOOL #5: Data Quality & Trust Scoring Platform
// ============================================================

export const qualityRules = sqliteTable("quality_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  datasetName: text("dataset_name").notNull(),
  ruleType: text("rule_type").notNull(), // completeness, accuracy, consistency, freshness
  condition: text("condition").notNull(), // JSON condition
  threshold: real("threshold").default(0.95),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const qualityResults = sqliteTable("quality_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ruleId: integer("rule_id").notNull(),
  datasetName: text("dataset_name").notNull(),
  score: real("score").notNull(), // 0-1
  status: text("status").notNull(), // pass, fail, warning
  details: text("details"), // JSON details
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const trustScores = sqliteTable("trust_scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  datasetName: text("dataset_name").notNull(),
  overallScore: real("overall_score").notNull(), // 0-100
  completenessScore: real("completeness_score").default(0),
  accuracyScore: real("accuracy_score").default(0),
  consistencyScore: real("consistency_score").default(0),
  freshnessScore: real("freshness_score").default(0),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const dataIncidents = sqliteTable("data_incidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  datasetName: text("dataset_name").notNull(),
  severity: text("severity").notNull(), // low, medium, high, critical
  status: text("status").default("open"), // open, investigating, resolved
  assignedTo: text("assigned_to"),
  rootCause: text("root_cause"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
});

// ============================================================
// TOOL #6: Data Contract Enforcement Engine
// ============================================================

export const dataContracts = sqliteTable("data_contracts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  datasetName: text("dataset_name").notNull(),
  version: text("version").default("v1.0"),
  schema: text("schema").notNull(), // JSON schema definition
  constraints: text("constraints"), // JSON constraints
  sla: text("sla"), // JSON SLA definition
  owner: text("owner"),
  status: text("status").default("active"), // active, deprecated, draft
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const contractValidations = sqliteTable("contract_validations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contractId: integer("contract_id").notNull(),
  status: text("status").notNull(), // pass, fail
  violations: text("violations"), // JSON array of violations
  validatedAt: integer("validated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const contractAlerts = sqliteTable("contract_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contractId: integer("contract_id").notNull(),
  alertType: text("alert_type").notNull(), // violation, sla_breach, schema_change
  message: text("message").notNull(),
  channel: text("channel"), // slack, email, webhook
  status: text("status").default("sent"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ============================================================
// TOOL #7: Autonomous Data Pipeline Optimizer
// ============================================================

export const pipelineMetrics = sqliteTable("pipeline_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pipelineId: integer("pipeline_id").notNull(),
  executionTime: real("execution_time"),
  cpuUsage: real("cpu_usage"),
  memoryUsage: real("memory_usage"),
  rowsProcessed: integer("rows_processed").default(0),
  costEstimate: real("cost_estimate").default(0),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const optimizationSuggestions = sqliteTable(
  "optimization_suggestions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pipelineId: integer("pipeline_id").notNull(),
    type: text("type").notNull(), // query_rewrite, indexing, partitioning, caching
    description: text("description").notNull(),
    currentPerformance: text("current_performance"),
    expectedImprovement: text("expected_improvement"),
    impact: text("impact").default("medium"), // low, medium, high
    status: text("status").default("pending"), // pending, applied, rejected
    appliedAt: integer("applied_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
  }
);

export const queryProfiles = sqliteTable("query_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  queryText: text("query_text").notNull(),
  executionTime: real("execution_time"),
  cost: real("cost"),
  rowsReturned: integer("rows_returned"),
  optimizationApplied: text("optimization_applied"),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ============================================================
// TOOL #8: Cross-Database Query Engine (Federated Analytics)
// ============================================================

export const virtualSchemas = sqliteTable("virtual_schemas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sourceConnectorId: integer("source_connector_id").notNull(),
  remoteTable: text("remote_table").notNull(),
  columnMappings: text("column_mappings"), // JSON
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const federatedQueries = sqliteTable("federated_queries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  queryText: text("query_text").notNull(),
  sourcesUsed: text("sources_used"), // JSON array
  executionPlan: text("execution_plan"), // JSON
  executionTime: real("execution_time"),
  rowsReturned: integer("rows_returned"),
  cached: integer("cached", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const queryCache = sqliteTable("query_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  queryHash: text("query_hash").notNull(),
  result: text("result").notNull(), // JSON cached result
  hitCount: integer("hit_count").default(0),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ============================================================
// TOOL #9: Data Drift & Model Monitoring Platform
// ============================================================

export const mlModels = sqliteTable("ml_models", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  version: text("version").default("v1.0"),
  type: text("type").notNull(), // classification, regression, anomaly_detection
  features: text("features"), // JSON array of feature names
  targetColumn: text("target_column"),
  status: text("status").default("active"), // active, degraded, retired
  deployedAt: integer("deployed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const modelPerformance = sqliteTable("model_performance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  modelId: integer("model_id").notNull(),
  accuracy: real("accuracy"),
  precision: real("precision"),
  recall: real("recall"),
  f1Score: real("f1_score"),
  aucRoc: real("auc_roc"),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const driftEvents = sqliteTable("drift_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  modelId: integer("model_id").notNull(),
  driftType: text("drift_type").notNull(), // feature, concept, prediction
  featureName: text("feature_name"),
  pValue: real("p_value"),
  driftMagnitude: real("drift_magnitude"),
  severity: text("severity").default("medium"),
  status: text("status").default("open"), // open, acknowledged, resolved
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const driftAlerts = sqliteTable("drift_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  driftEventId: integer("drift_event_id").notNull(),
  message: text("message").notNull(),
  channel: text("channel"),
  status: text("status").default("sent"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

// ============================================================
// TOOL #10: Executive AI Decision Engine
// ============================================================

export const kpiMetrics = sqliteTable("kpi_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(), // revenue, cost, risk, operational
  value: real("value").notNull(),
  previousValue: real("previous_value"),
  unit: text("unit"),
  trend: text("trend"), // up, down, stable
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const aiRecommendations = sqliteTable("ai_recommendations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // cost, revenue, risk, operational
  confidence: real("confidence"), // 0-1
  impact: text("impact").default("medium"),
  relatedKpis: text("related_kpis"), // JSON array
  status: text("status").default("pending"), // pending, accepted, rejected, implemented
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const scenarios = sqliteTable("scenarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  parameters: text("parameters").notNull(), // JSON input params
  predictedOutcome: text("predicted_outcome"), // JSON results
  confidence: real("confidence"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const executiveAlerts = sqliteTable("executive_alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(),
  source: text("source"), // which tool generated it
  status: text("status").default("unread"), // unread, read, dismissed
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});
