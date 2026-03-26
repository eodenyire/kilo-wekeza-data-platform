import { db } from "./index";
import {
  dataAssets,
  lineageEdges,
  pipelineRuns,
  observabilityMetrics,
  nlqQueries,
  semanticMappings,
  connectors,
  pipelines,
  pipelineExecutions,
  transactions,
  fraudRules,
  fraudAlerts,
  qualityRules,
  qualityResults,
  trustScores,
  dataIncidents,
  dataContracts,
  contractValidations,
  pipelineMetrics,
  optimizationSuggestions,
  queryProfiles,
  virtualSchemas,
  federatedQueries,
  mlModels,
  modelPerformance,
  driftEvents,
  kpiMetrics,
  aiRecommendations,
  scenarios,
  executiveAlerts,
} from "./schema";

export async function seed() {
  console.log("Seeding Wekeza Data Platform...");

  // Tool #1: Data Assets
  const assets = await db
    .insert(dataAssets)
    .values([
      {
        name: "customers",
        type: "table",
        source: "postgres",
        schema: JSON.stringify({
          columns: [
            { name: "id", type: "integer" },
            { name: "name", type: "varchar" },
            { name: "email", type: "varchar" },
            { name: "created_at", type: "timestamp" },
          ],
        }),
        rowCount: 125000,
        status: "active",
      },
      {
        name: "transactions",
        type: "table",
        source: "postgres",
        schema: JSON.stringify({
          columns: [
            { name: "id", type: "integer" },
            { name: "customer_id", type: "integer" },
            { name: "amount", type: "decimal" },
            { name: "timestamp", type: "timestamp" },
          ],
        }),
        rowCount: 2500000,
        status: "active",
      },
      {
        name: "fraud_events",
        type: "table",
        source: "mongodb",
        schema: JSON.stringify({
          columns: [
            { name: "_id", type: "objectId" },
            { name: "transaction_id", type: "integer" },
            { name: "risk_score", type: "float" },
            { name: "detection_method", type: "string" },
          ],
        }),
        rowCount: 45000,
        status: "active",
      },
      {
        name: "user_activity",
        type: "stream",
        source: "kafka",
        rowCount: 10000000,
        status: "active",
      },
      {
        name: "revenue_dashboard",
        type: "view",
        source: "postgres",
        rowCount: 365,
        status: "active",
      },
      {
        name: "customer_segments",
        type: "table",
        source: "postgres",
        rowCount: 8,
        status: "active",
      },
      {
        name: "ml_predictions",
        type: "table",
        source: "postgres",
        rowCount: 500000,
        status: "active",
      },
      {
        name: "audit_log",
        type: "table",
        source: "postgres",
        rowCount: 1500000,
        status: "inactive",
      },
    ])
    .returning();

  // Lineage Edges
  await db.insert(lineageEdges).values([
    { sourceId: assets[0].id, targetId: assets[1].id, transformationType: "reference" },
    { sourceId: assets[1].id, targetId: assets[2].id, transformationType: "transform" },
    { sourceId: assets[1].id, targetId: assets[4].id, transformationType: "aggregate" },
    { sourceId: assets[0].id, targetId: assets[5].id, transformationType: "transform" },
    { sourceId: assets[3].id, targetId: assets[6].id, transformationType: "transform" },
    { sourceId: assets[1].id, targetId: assets[7].id, transformationType: "copy" },
  ]);

  // Pipeline Runs
  await db.insert(pipelineRuns).values([
    { pipelineName: "daily_etl_customers", status: "success", startTime: new Date("2026-03-25T02:00:00"), endTime: new Date("2026-03-25T02:15:00"), rowsProcessed: 125000 },
    { pipelineName: "transaction_ingestion", status: "success", startTime: new Date("2026-03-25T03:00:00"), endTime: new Date("2026-03-25T03:45:00"), rowsProcessed: 2500000 },
    { pipelineName: "fraud_scoring", status: "failed", startTime: new Date("2026-03-25T04:00:00"), endTime: new Date("2026-03-25T04:02:00"), rowsProcessed: 0, errorMessage: "Connection timeout to MongoDB" },
    { pipelineName: "ml_feature_pipeline", status: "success", startTime: new Date("2026-03-25T05:00:00"), endTime: new Date("2026-03-25T05:30:00"), rowsProcessed: 500000 },
    { pipelineName: "revenue_aggregation", status: "running", startTime: new Date("2026-03-26T02:00:00"), rowsProcessed: 0 },
  ]);

  // Observability Metrics
  await db.insert(observabilityMetrics).values([
    { assetId: assets[0].id, metricType: "freshness", value: 15, threshold: 60, status: "ok" },
    { assetId: assets[1].id, metricType: "freshness", value: 5, threshold: 30, status: "ok" },
    { assetId: assets[2].id, metricType: "freshness", value: 120, threshold: 60, status: "critical" },
    { assetId: assets[3].id, metricType: "volume", value: 10000000, threshold: 5000000, status: "warning" },
    { assetId: assets[1].id, metricType: "error_rate", value: 0.02, threshold: 0.05, status: "ok" },
    { assetId: assets[4].id, metricType: "latency", value: 250, threshold: 500, status: "ok" },
  ]);

  // Tool #2: NLQ Queries
  await db.insert(nlqQueries).values([
    { naturalLanguage: "Show fraud trends in Nairobi last 6 months", generatedSql: "SELECT DATE_TRUNC('month', timestamp) AS month, COUNT(*) AS fraud_count FROM fraud_events WHERE location = 'Nairobi' AND timestamp >= NOW() - INTERVAL '6 months' GROUP BY month ORDER BY month", chartType: "line", executionTime: 1.2, success: true, feedbackRating: 5 },
    { naturalLanguage: "Top 10 customers by transaction volume", generatedSql: "SELECT c.name, COUNT(t.id) AS txn_count, SUM(t.amount) AS total FROM customers c JOIN transactions t ON c.id = t.customer_id GROUP BY c.name ORDER BY total DESC LIMIT 10", chartType: "bar", executionTime: 0.8, success: true, feedbackRating: 4 },
    { naturalLanguage: "Revenue trend this year", generatedSql: "SELECT DATE_TRUNC('month', timestamp) AS month, SUM(amount) AS revenue FROM transactions WHERE timestamp >= '2026-01-01' GROUP BY month ORDER BY month", chartType: "line", executionTime: 0.5, success: true },
    { naturalLanguage: "Average transaction amount by channel", generatedSql: "SELECT channel, AVG(amount) AS avg_amount FROM transactions GROUP BY channel", chartType: "bar", executionTime: 0.3, success: true },
    { naturalLanguage: "Show me customers who havent transacted in 30 days", generatedSql: "SELECT c.* FROM customers c LEFT JOIN transactions t ON c.id = t.customer_id AND t.timestamp >= NOW() - INTERVAL '30 days' WHERE t.id IS NULL", chartType: "table", executionTime: 2.1, success: true, feedbackRating: 3 },
  ]);

  await db.insert(semanticMappings).values([
    { businessTerm: "Customers", databaseTable: "customers", databaseColumn: "*", description: "All registered customers" },
    { businessTerm: "Revenue", databaseTable: "transactions", databaseColumn: "amount", description: "Transaction amounts" },
    { businessTerm: "Fraud Cases", databaseTable: "fraud_events", databaseColumn: "*", description: "Detected fraud events" },
    { businessTerm: "Active Users", databaseTable: "user_activity", databaseColumn: "user_id", description: "Users with recent activity" },
  ]);

  // Tool #3: Connectors and Pipelines
  const conns = await db.insert(connectors).values([
    { name: "Production Postgres", type: "postgres", status: "active" },
    { name: "Fraud MongoDB", type: "mongodb", status: "active" },
    { name: "Activity Kafka", type: "kafka", status: "active" },
    { name: "External API", type: "api", status: "active" },
    { name: "Legacy Oracle", type: "oracle", status: "inactive" },
  ]).returning();

  const pipes = await db.insert(pipelines).values([
    { name: "Customer ETL", description: "Daily customer data extraction", sourceConnectorId: conns[0].id, targetConnectorId: conns[0].id, schedule: "0 2 * * *", status: "active" },
    { name: "Transaction Ingestion", description: "Real-time transaction pipeline", sourceConnectorId: conns[2].id, targetConnectorId: conns[0].id, schedule: "* * * * *", status: "active" },
    { name: "Fraud Scoring", description: "ML fraud scoring pipeline", sourceConnectorId: conns[0].id, targetConnectorId: conns[1].id, schedule: "*/5 * * * *", status: "active" },
    { name: "Legacy Migration", description: "Oracle to Postgres migration", sourceConnectorId: conns[4].id, targetConnectorId: conns[0].id, status: "draft" },
  ]).returning();

  await db.insert(pipelineExecutions).values([
    { pipelineId: pipes[0].id, status: "success", startTime: new Date("2026-03-25T02:00:00"), endTime: new Date("2026-03-25T02:15:00"), rowsIn: 125000, rowsOut: 125000 },
    { pipelineId: pipes[1].id, status: "success", startTime: new Date("2026-03-26T10:00:00"), endTime: new Date("2026-03-26T10:01:00"), rowsIn: 5000, rowsOut: 5000 },
    { pipelineId: pipes[2].id, status: "failed", startTime: new Date("2026-03-26T10:00:00"), endTime: new Date("2026-03-26T10:02:00"), rowsIn: 0, rowsOut: 0, errorMessage: "MongoDB connection timeout" },
    { pipelineId: pipes[0].id, status: "success", startTime: new Date("2026-03-24T02:00:00"), endTime: new Date("2026-03-24T02:12:00"), rowsIn: 124800, rowsOut: 124800 },
  ]);

  // Tool #4: Transactions and Fraud
  const fraudRuleData = await db.insert(fraudRules).values([
    { name: "Large Transaction", description: "Transactions over 100,000 KES", condition: JSON.stringify({ field: "amount", operator: ">", value: 100000 }), severity: "high", triggeredCount: 342 },
    { name: "Rapid Transactions", description: "Multiple transactions in under 1 minute", condition: JSON.stringify({ field: "time_delta", operator: "<", value: 60 }), severity: "critical", triggeredCount: 89 },
    { name: "Location Mismatch", description: "Transaction location differs from account", condition: JSON.stringify({ field: "location_match", operator: "==", value: false }), severity: "medium", triggeredCount: 1250 },
    { name: "New Account Large Amount", description: "Large transaction on account less than 7 days old", condition: JSON.stringify({ field: "account_age_days", operator: "<", value: 7 }), severity: "high", triggeredCount: 45 },
  ]).returning();

  const txData = await db.insert(transactions).values([
    { transactionRef: "TXN-001", amount: 250000, sourceAccount: "ACC-1001", targetAccount: "ACC-2001", channel: "mobile", location: "Nairobi", riskScore: 85, isFraud: true, detectionMethod: "rule" },
    { transactionRef: "TXN-002", amount: 5000, sourceAccount: "ACC-1002", targetAccount: "ACC-2002", channel: "web", location: "Mombasa", riskScore: 12, isFraud: false, detectionMethod: "rule" },
    { transactionRef: "TXN-003", amount: 150000, sourceAccount: "ACC-1003", targetAccount: "ACC-2003", channel: "atm", location: "Kisumu", riskScore: 72, isFraud: true, detectionMethod: "ml" },
    { transactionRef: "TXN-004", amount: 8500, sourceAccount: "ACC-1004", targetAccount: "ACC-2004", channel: "mobile", location: "Nairobi", riskScore: 15, isFraud: false, detectionMethod: "rule" },
    { transactionRef: "TXN-005", amount: 320000, sourceAccount: "ACC-1005", targetAccount: "ACC-2005", channel: "branch", location: "Nakuru", riskScore: 91, isFraud: true, detectionMethod: "graph" },
  ]).returning();

  await db.insert(fraudAlerts).values([
    { transactionId: txData[0].id, ruleId: fraudRuleData[0].id, alertType: "rule", severity: "high", status: "investigating", assignedTo: "analyst@wekeza.com" },
    { transactionId: txData[2].id, alertType: "ml_anomaly", severity: "medium", status: "open" },
    { transactionId: txData[4].id, ruleId: fraudRuleData[1].id, alertType: "graph_pattern", severity: "critical", status: "open" },
  ]);

  // Tool #5: Data Quality
  await db.insert(qualityRules).values([
    { name: "No null customer IDs", datasetName: "transactions", ruleType: "completeness", condition: JSON.stringify({ column: "customer_id", check: "not_null" }), threshold: 0.99 },
    { name: "Amount > 0", datasetName: "transactions", ruleType: "accuracy", condition: JSON.stringify({ column: "amount", check: "greater_than", value: 0 }), threshold: 1.0 },
    { name: "Email format valid", datasetName: "customers", ruleType: "accuracy", condition: JSON.stringify({ column: "email", check: "regex", pattern: "^.+@.+\\..+$" }), threshold: 0.95 },
    { name: "Data freshness 1h", datasetName: "transactions", ruleType: "freshness", condition: JSON.stringify({ column: "timestamp", check: "max_age_minutes", value: 60 }), threshold: 0.9 },
    { name: "No duplicate transactions", datasetName: "transactions", ruleType: "consistency", condition: JSON.stringify({ column: "transaction_ref", check: "unique" }), threshold: 1.0 },
  ]);

  await db.insert(qualityResults).values([
    { ruleId: 1, datasetName: "transactions", score: 0.998, status: "pass" },
    { ruleId: 2, datasetName: "transactions", score: 1.0, status: "pass" },
    { ruleId: 3, datasetName: "customers", score: 0.92, status: "warning" },
    { ruleId: 4, datasetName: "transactions", score: 0.85, status: "fail" },
    { ruleId: 5, datasetName: "transactions", score: 0.999, status: "pass" },
  ]);

  await db.insert(trustScores).values([
    { datasetName: "customers", overallScore: 94, completenessScore: 98, accuracyScore: 92, consistencyScore: 95, freshnessScore: 90 },
    { datasetName: "transactions", overallScore: 88, completenessScore: 99, accuracyScore: 100, consistencyScore: 99, freshnessScore: 85 },
    { datasetName: "fraud_events", overallScore: 76, completenessScore: 85, accuracyScore: 78, consistencyScore: 80, freshnessScore: 60 },
    { datasetName: "user_activity", overallScore: 91, completenessScore: 95, accuracyScore: 90, consistencyScore: 88, freshnessScore: 92 },
  ]);

  await db.insert(dataIncidents).values([
    { title: "Transaction data delayed 2 hours", description: "Kafka consumer lag caused data delay", datasetName: "transactions", severity: "high", status: "resolved", rootCause: "Kafka consumer group rebalance" },
    { title: "Customer email validation failures spiking", description: "12% of new signups have invalid emails", datasetName: "customers", severity: "medium", status: "investigating" },
  ]);

  // Tool #6: Data Contracts
  await db.insert(dataContracts).values([
    { name: "Transaction Schema", datasetName: "transactions", version: "v2.1", schema: JSON.stringify({ columns: [{ name: "id", type: "integer", required: true }, { name: "amount", type: "decimal", required: true, min: 0 }, { name: "customer_id", type: "integer", required: true }] }), sla: JSON.stringify({ freshness: "5 minutes", volume: "> 1000 records/hour" }), owner: "data-team@wekeza.com", status: "active" },
    { name: "Customer Schema", datasetName: "customers", version: "v1.3", schema: JSON.stringify({ columns: [{ name: "id", type: "integer", required: true }, { name: "email", type: "string", required: true, unique: true }] }), owner: "platform-team@wekeza.com", status: "active" },
    { name: "Fraud Events Schema", datasetName: "fraud_events", version: "v1.0", schema: JSON.stringify({ columns: [{ name: "transaction_id", type: "integer", required: true }, { name: "risk_score", type: "float", required: true }] }), sla: JSON.stringify({ freshness: "1 minute" }), owner: "risk-team@wekeza.com", status: "active" },
  ]);

  await db.insert(contractValidations).values([
    { contractId: 1, status: "pass", violations: "[]" },
    { contractId: 2, status: "fail", violations: JSON.stringify([{ column: "email", issue: "null values detected", count: 23 }]) },
    { contractId: 3, status: "pass", violations: "[]" },
  ]);

  // Tool #7: Pipeline Optimizer
  await db.insert(pipelineMetrics).values([
    { pipelineId: pipes[0].id, executionTime: 900, cpuUsage: 65, memoryUsage: 40, rowsProcessed: 125000, costEstimate: 2.5 },
    { pipelineId: pipes[1].id, executionTime: 60, cpuUsage: 80, memoryUsage: 55, rowsProcessed: 5000, costEstimate: 0.3 },
    { pipelineId: pipes[2].id, executionTime: 120, cpuUsage: 90, memoryUsage: 70, rowsProcessed: 0, costEstimate: 0.8 },
  ]);

  await db.insert(optimizationSuggestions).values([
    { pipelineId: pipes[0].id, type: "indexing", description: "Add index on customers.created_at column", currentPerformance: "Full table scan on date filter", expectedImprovement: "60% faster queries", impact: "high", status: "pending" },
    { pipelineId: pipes[1].id, type: "partitioning", description: "Partition transactions table by month", currentPerformance: "Scans 2.5M rows per query", expectedImprovement: "80% reduction in scanned rows", impact: "high", status: "applied", appliedAt: new Date("2026-03-20") },
    { pipelineId: pipes[2].id, type: "caching", description: "Cache reference data for fraud scoring", currentPerformance: "Re-fetches lookup tables every run", expectedImprovement: "40% faster execution", impact: "medium", status: "pending" },
    { pipelineId: pipes[0].id, type: "query_rewrite", description: "Replace subquery with JOIN in ETL step 3", currentPerformance: "Nested subquery takes 45s", expectedImprovement: "90% faster", impact: "high", status: "rejected" },
  ]);

  await db.insert(queryProfiles).values([
    { queryText: "SELECT * FROM transactions WHERE DATE(timestamp) = '2026-03-25'", executionTime: 4.5, cost: 12.3, rowsReturned: 50000 },
    { queryText: "SELECT customer_id, SUM(amount) FROM transactions GROUP BY customer_id", executionTime: 8.2, cost: 25.0, rowsReturned: 125000 },
    { queryText: "SELECT * FROM customers c JOIN transactions t ON c.id = t.customer_id", executionTime: 15.0, cost: 45.5, rowsReturned: 2500000 },
  ]);

  // Tool #8: Federated Queries
  await db.insert(virtualSchemas).values([
    { name: "v_customers", sourceConnectorId: conns[0].id, remoteTable: "customers" },
    { name: "v_transactions", sourceConnectorId: conns[0].id, remoteTable: "transactions" },
    { name: "v_fraud_events", sourceConnectorId: conns[1].id, remoteTable: "fraud_events" },
  ]);

  await db.insert(federatedQueries).values([
    { queryText: "SELECT c.name, f.risk_score FROM v_customers c JOIN v_transactions t ON c.id = t.customer_id JOIN v_fraud_events f ON t.id = f.transaction_id", sourcesUsed: JSON.stringify(["postgres", "mongodb"]), executionTime: 3.2, rowsReturned: 450, cached: false },
    { queryText: "SELECT * FROM v_transactions WHERE amount > 100000", sourcesUsed: JSON.stringify(["postgres"]), executionTime: 1.1, rowsReturned: 12500, cached: true },
    { queryText: "SELECT channel, COUNT(*), AVG(amount) FROM v_transactions GROUP BY channel", sourcesUsed: JSON.stringify(["postgres"]), executionTime: 0.8, rowsReturned: 4, cached: true },
  ]);

  // Tool #9: ML Models and Drift
  const models = await db.insert(mlModels).values([
    { name: "Fraud Detection v2", version: "v2.1", type: "classification", features: JSON.stringify(["amount", "channel", "location", "account_age", "velocity"]), targetColumn: "is_fraud", status: "active" },
    { name: "Churn Prediction", version: "v1.3", type: "classification", features: JSON.stringify(["login_frequency", "transaction_count", "support_tickets", "tenure"]), targetColumn: "churned", status: "active" },
    { name: "Transaction Anomaly", version: "v1.0", type: "anomaly_detection", features: JSON.stringify(["amount", "time_of_day", "merchant_category"]), status: "degraded" },
  ]).returning();

  await db.insert(modelPerformance).values([
    { modelId: models[0].id, accuracy: 0.94, precision: 0.89, recall: 0.82, f1Score: 0.85, aucRoc: 0.96 },
    { modelId: models[0].id, accuracy: 0.91, precision: 0.85, recall: 0.78, f1Score: 0.81, aucRoc: 0.93 },
    { modelId: models[1].id, accuracy: 0.87, precision: 0.83, recall: 0.79, f1Score: 0.81, aucRoc: 0.91 },
    { modelId: models[2].id, accuracy: 0.72, precision: 0.68, recall: 0.65, f1Score: 0.66, aucRoc: 0.78 },
  ]);

  await db.insert(driftEvents).values([
    { modelId: models[0].id, driftType: "feature", featureName: "amount", pValue: 0.02, driftMagnitude: 0.35, severity: "medium", status: "open" },
    { modelId: models[2].id, driftType: "concept", featureName: "overall", pValue: 0.001, driftMagnitude: 0.72, severity: "critical", status: "open" },
    { modelId: models[1].id, driftType: "feature", featureName: "login_frequency", pValue: 0.08, driftMagnitude: 0.15, severity: "low", status: "acknowledged" },
  ]);

  // Tool #10: Executive AI
  await db.insert(kpiMetrics).values([
    { name: "Total Revenue", category: "revenue", value: 12500000, previousValue: 11800000, unit: "KES", trend: "up" },
    { name: "Fraud Loss Rate", category: "risk", value: 0.8, previousValue: 1.2, unit: "%", trend: "down" },
    { name: "Pipeline Uptime", category: "operational", value: 99.7, previousValue: 99.2, unit: "%", trend: "up" },
    { name: "Data Quality Score", category: "operational", value: 87.2, previousValue: 85.0, unit: "score", trend: "up" },
    { name: "Infrastructure Cost", category: "cost", value: 45000, previousValue: 48000, unit: "USD/month", trend: "down" },
    { name: "Active Users", category: "revenue", value: 85000, previousValue: 78000, unit: "users", trend: "up" },
    { name: "ML Model Accuracy", category: "operational", value: 91.5, previousValue: 89.0, unit: "%", trend: "up" },
    { name: "Query Response Time", category: "operational", value: 1.8, previousValue: 2.3, unit: "seconds", trend: "down" },
  ]);

  await db.insert(aiRecommendations).values([
    { title: "Optimize transaction partitioning", description: "Partitioning the transactions table by month could reduce query costs by 40%. Current monthly cost: $12,500.", category: "cost", confidence: 0.92, impact: "high", status: "pending" },
    { title: "Increase fraud monitoring in Nairobi region", description: "Fraud attempts in Nairobi increased 28% this month. Recommend deploying additional ML model instances.", category: "risk", confidence: 0.87, impact: "high", status: "pending" },
    { title: "Upgrade Kafka consumer capacity", description: "Consumer lag is above threshold 15% of the time. Scaling up would prevent data freshness issues.", category: "operational", confidence: 0.95, impact: "medium", status: "accepted" },
    { title: "Consolidate duplicate data pipelines", description: "3 pipelines are performing overlapping data extraction. Merging them would save $3,200/month.", category: "cost", confidence: 0.81, impact: "medium", status: "pending" },
    { title: "Deploy customer churn model to production", description: "Churn model achieves 87% accuracy. Deploying now could reduce churn by an estimated 12%.", category: "revenue", confidence: 0.78, impact: "high", status: "pending" },
  ]);

  await db.insert(scenarios).values([
    { name: "Fraud Spike +20%", description: "What happens if fraud attempts increase by 20%?", parameters: JSON.stringify({ fraud_increase: 0.2, monitoring_capacity: "current" }), predictedOutcome: JSON.stringify({ additional_losses: 250000, detection_rate_change: -5, alert_volume_increase: 35 }), confidence: 0.85 },
    { name: "Infrastructure Cost Reduction", description: "Impact of migrating to spot instances", parameters: JSON.stringify({ spot_instance_ratio: 0.7, current_cost: 45000 }), predictedOutcome: JSON.stringify({ new_cost: 31500, savings: 13500, reliability_impact: -2 }), confidence: 0.72 },
    { name: "User Growth +50%", description: "Platform performance at 50% user growth", parameters: JSON.stringify({ user_growth: 0.5, current_users: 85000 }), predictedOutcome: JSON.stringify({ projected_users: 127500, infrastructure_cost_increase: 35, query_latency_increase: 20 }), confidence: 0.68 },
  ]);

  await db.insert(executiveAlerts).values([
    { title: "Fraud Detection Model Degraded", message: "Transaction Anomaly model accuracy dropped below 75%. Immediate attention required.", severity: "critical", source: "drift_monitor" },
    { title: "Pipeline Failure", message: "Fraud Scoring pipeline failed. 2 hours of unscored transactions.", severity: "high", source: "pipeline" },
    { title: "Revenue Milestone", message: "Monthly revenue exceeded KES 12.5M for the first time.", severity: "low", source: "executive" },
    { title: "Data Quality Alert", message: "Transaction data freshness SLA breached. 2-hour delay detected.", severity: "medium", source: "quality" },
  ]);

  console.log("Seed complete!");
}
