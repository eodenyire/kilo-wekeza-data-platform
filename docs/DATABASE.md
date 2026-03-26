# Database — Wekeza Data Platform

## Overview

The platform uses **SQLite** via the `@kilocode/app-builder-db` package with **Drizzle ORM** for type-safe queries. The database contains **35 tables** across all 10 tools.

---

## Schema Design Principles

1. **Normalized**: Each tool has its own set of tables with clear ownership
2. **JSON for flexibility**: Schema definitions, constraints, conditions, and configurations stored as JSON strings
3. **Timestamps everywhere**: Every table has `created_at` or `recorded_at` for time-series analysis
4. **Status fields**: Most tables have a `status` field for workflow tracking
5. **Referential integrity**: Foreign keys link related entities (e.g., `pipeline_id` in executions)

---

## Table Map by Tool

### Tool #1 — Data Lineage & Observability (4 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `data_assets` | Registered data sources | name, type, source, schema, row_count, status |
| `lineage_edges` | Source → target relationships | source_id, target_id, transformation_type |
| `pipeline_runs` | Pipeline execution history | pipeline_name, status, rows_processed, error_message |
| `observability_metrics` | Freshness/volume/latency metrics | asset_id, metric_type, value, threshold, status |

### Tool #2 — NLQ Engine (3 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `nlq_queries` | Natural language query history | natural_language, generated_sql, chart_type, success |
| `semantic_mappings` | Business term → DB column mapping | business_term, database_table, database_column |
| `conversation_history` | Multi-turn context | session_id, role, content |

### Tool #3 — Data Integration (3 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `connectors` | Data source definitions | name, type, config, status |
| `pipelines` | Pipeline configurations | name, source_connector_id, target_connector_id, schedule, status |
| `pipeline_executions` | Execution records | pipeline_id, status, rows_in, rows_out, error_message |

### Tool #4 — Fraud & Risk (4 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `transactions` | Transaction records | amount, currency, source_account, channel, location, risk_score, is_fraud |
| `fraud_rules` | Detection rule definitions | name, condition (JSON), severity, triggered_count |
| `fraud_alerts` | Fraud detection alerts | transaction_id, rule_id, alert_type, severity, status |
| `risk_simulations` | What-if scenarios | name, parameters (JSON), results (JSON) |

### Tool #5 — Data Quality (4 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `quality_rules` | Quality check definitions | name, dataset_name, rule_type, condition (JSON), threshold |
| `quality_results` | Rule evaluation results | rule_id, dataset_name, score, status |
| `trust_scores` | Aggregated trust scores | dataset_name, overall_score, completeness/accuracy/consistency/freshness_scores |
| `data_incidents` | Quality issue tracking | title, dataset_name, severity, status, root_cause |

### Tool #6 — Data Contracts (3 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `data_contracts` | Contract definitions | name, dataset_name, version, schema (JSON), constraints (JSON), sla (JSON), owner |
| `contract_validations` | Validation results | contract_id, status, violations (JSON) |
| `contract_alerts` | Violation alerts | contract_id, alert_type, message, channel |

### Tool #7 — Pipeline Optimizer (3 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `pipeline_metrics` | Performance measurements | pipeline_id, execution_time, cpu_usage, memory_usage, cost_estimate |
| `optimization_suggestions` | AI recommendations | pipeline_id, type, description, impact, status |
| `query_profiles` | Query performance data | query_text, execution_time, cost, rows_returned |

### Tool #8 — Federated Queries (3 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `virtual_schemas` | Remote table mappings | name, source_connector_id, remote_table, column_mappings (JSON) |
| `federated_queries` | Query history | query_text, sources_used (JSON), execution_time, rows_returned, cached |
| `query_cache` | Cached query results | query_hash, result (JSON), hit_count, expires_at |

### Tool #9 — ML Drift Monitor (4 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `ml_models` | Model registry | name, version, type, features (JSON), target_column, status |
| `model_performance` | Performance metrics | model_id, accuracy, precision, recall, f1_score, auc_roc |
| `drift_events` | Drift detections | model_id, drift_type, feature_name, p_value, drift_magnitude, severity |
| `drift_alerts` | Drift notifications | drift_event_id, message, channel |

### Tool #10 — Executive AI (4 tables)

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `kpi_metrics` | Key performance indicators | name, category, value, previous_value, unit, trend |
| `ai_recommendations` | AI action suggestions | title, description, category, confidence, impact, status |
| `scenarios` | What-if simulations | name, parameters (JSON), predicted_outcome (JSON), confidence |
| `executive_alerts` | Critical notifications | title, message, severity, source, status |

---

## Entity Relationships

```
data_assets ──┬── lineage_edges (source_id → data_assets.id)
              │                    (target_id → data_assets.id)
              └── observability_metrics (asset_id → data_assets.id)

connectors ──┬── pipelines (source_connector_id → connectors.id)
             │             (target_connector_id → connectors.id)
             ├── pipeline_executions (pipeline_id → pipelines.id)
             └── virtual_schemas (source_connector_id → connectors.id)

transactions ── fraud_alerts (transaction_id → transactions.id)
fraud_rules ─── fraud_alerts (rule_id → fraud_rules.id)

quality_rules ── quality_results (rule_id → quality_rules.id)

data_contracts ──┬── contract_validations (contract_id → data_contracts.id)
                 └── contract_alerts (contract_id → data_contracts.id)

pipelines ──┬── pipeline_metrics (pipeline_id → pipelines.id)
            └── optimization_suggestions (pipeline_id → pipelines.id)

ml_models ──┬── model_performance (model_id → ml_models.id)
            └── drift_events (model_id → ml_models.id)
drift_events ── drift_alerts (drift_event_id → drift_events.id)
```

---

## JSON Field Formats

### Schema fields (data_assets, data_contracts)
```json
{
  "columns": [
    { "name": "id", "type": "integer", "required": true },
    { "name": "amount", "type": "decimal", "required": true, "min": 0 },
    { "name": "email", "type": "string", "required": true, "unique": true }
  ]
}
```

### Condition fields (quality_rules, fraud_rules)
```json
// Quality: completeness check
{ "column": "customer_id", "check": "not_null" }

// Quality: accuracy check
{ "column": "amount", "check": "greater_than", "value": 0 }

// Quality: freshness check
{ "column": "timestamp", "check": "max_age_minutes", "value": 60 }

// Fraud: rule condition
{ "field": "amount", "operator": ">", "value": 100000 }
```

### SLA fields (data_contracts)
```json
{
  "freshness": "5 minutes",
  "volume": "> 1000 records/hour"
}
```

### Simulation parameters (risk_simulations, scenarios)
```json
{
  "fraud_increase": 0.2,
  "monitoring_capacity": "current"
}
```

---

## Seed Data

The `src/db/seed.ts` script populates realistic demo data:

| Tool | Seeded Records |
|------|---------------|
| Lineage | 8 assets, 6 edges, 5 pipeline runs, 6 metrics |
| NLQ | 5 queries, 4 semantic mappings |
| Pipelines | 5 connectors, 4 pipelines, 4 executions |
| Fraud | 5 transactions, 4 rules, 3 alerts |
| Quality | 5 rules, 5 results, 4 trust scores, 2 incidents |
| Contracts | 3 contracts, 3 validations |
| Optimizer | 3 metrics, 4 suggestions, 3 query profiles |
| Federated | 3 virtual schemas, 3 queries |
| Drift | 3 models, 4 performance records, 3 drift events |
| Executive | 8 KPIs, 5 recommendations, 3 scenarios, 4 alerts |

---

## Migration

Migrations run automatically in the sandbox. To regenerate:

```bash
bun db:generate
```

Migration files are stored in `src/db/migrations/` and applied via `bun db:migrate` (automatic in sandbox).
