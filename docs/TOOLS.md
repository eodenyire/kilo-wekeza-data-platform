# Tools — Wekeza Data Platform

Complete documentation for all 10 integrated tools.

---

## Tool #1: Data Lineage & Observability Engine

**Route**: `/tool/lineage` | **API**: `/api/lineage`

### Purpose

Provide end-to-end visibility of data movement across heterogeneous systems. Know where data comes from, how it transforms, and where it goes.

### How It Works

1. **Data Assets** are registered with their type (table, view, stream, file), source system (Postgres, MongoDB, Kafka), and schema definition
2. **Lineage Edges** connect assets, showing data flow: source → transformation → destination
3. **Pipeline Runs** track execution status, rows processed, and errors
4. **Observability Metrics** continuously monitor freshness, volume, latency, and error rates

### Database Tables

| Table | Purpose |
|-------|---------|
| `data_assets` | Registered data sources with schema and status |
| `lineage_edges` | Source → target relationships with transformation type |
| `pipeline_runs` | Execution history with status and row counts |
| `observability_metrics` | Freshness, volume, latency, error rate per asset |

### Usage

**Viewing the lineage graph:**
1. Navigate to `/tool/lineage`
2. The "Lineage Graph" section shows all edges as visual flow:
   ```
   customers ──reference──→ transactions ──transform──→ fraud_events
   ```
3. Each node shows the asset name, source, and current status

**Checking observability:**
1. Scroll to "Observability Metrics" table
2. Metrics show current value vs threshold
3. Status badges indicate: `ok` (green), `warning` (yellow), `critical` (red)

**Adding a new data asset:**
```bash
curl -X POST http://localhost:3000/api/lineage \
  -H "Content-Type: application/json" \
  -d '{"name": "orders", "type": "table", "source": "postgres", "rowCount": 50000}'
```

### Key Metrics

- **Total Assets**: Number of registered data sources
- **Lineage Edges**: Number of data flow connections
- **Pipeline Failures**: Count of failed pipeline runs
- **Active Assets**: Assets currently marked as active

---

## Tool #2: Natural Language Query Engine

**Route**: `/tool/nlq` | **API**: `/api/nlq`

### Purpose

Enable non-technical users to query enterprise data using plain English. Automatically generates SQL, selects chart types, and produces insights.

### How It Works

1. User types a question in English (e.g., "Show fraud trends in Nairobi last 6 months")
2. System parses intent, identifies entities and time ranges
3. **Semantic Layer** maps business terms to database columns
4. SQL is generated with appropriate joins and filters
5. Chart type is auto-selected (line for trends, bar for comparisons, etc.)

### Database Tables

| Table | Purpose |
|-------|---------|
| `nlq_queries` | History of natural language queries with generated SQL |
| `semantic_mappings` | Business term → database column mappings |
| `conversation_history` | Multi-turn conversation context |

### Usage

**Running a query:**
1. Navigate to `/tool/nlq`
2. Type your question in the input box
3. Click "Generate SQL"
4. View the generated SQL, chart type, and execution time below

**Example queries:**
- "Top 10 customers by transaction volume"
- "Revenue trend this year"
- "Average transaction amount by channel"
- "Show customers who haven't transacted in 30 days"

**Semantic layer:**
The "Semantic Layer" section shows how business terms map to database:
| Business Term | Table | Column |
|--------------|-------|--------|
| Customers | customers | * |
| Revenue | transactions | amount |
| Fraud Cases | fraud_events | * |

**Submitting a query via API:**
```bash
curl -X POST http://localhost:3000/api/nlq \
  -H "Content-Type: application/json" \
  -d '{"action": "query", "naturalLanguage": "Show top customers by revenue"}'
```

---

## Tool #3: Data Integration Platform

**Route**: `/tool/pipeline` | **API**: `/api/pipeline`

### Purpose

Connect, ingest, and transform data from multiple sources. Build pipelines with scheduling, monitoring, and error handling.

### How It Works

1. **Connectors** define data source connections (Postgres, MongoDB, Kafka, APIs, files)
2. **Pipelines** define the flow: source → transformation → destination, with cron schedules
3. **Executions** track each run: rows in/out, duration, errors

### Database Tables

| Table | Purpose |
|-------|---------|
| `connectors` | Data source definitions with type and config |
| `pipelines` | Pipeline definitions with schedule and status |
| `pipeline_executions` | Run history with row counts and errors |

### Usage

**Viewing connectors:**
1. Navigate to `/tool/pipeline`
2. The "Data Connectors" section lists all configured sources
3. Each shows name, type, and connection status

**Viewing pipelines:**
1. Scroll to "Pipelines" section
2. Each pipeline shows its name, description, schedule (cron), and status
3. Statuses: `draft`, `active`, `paused`, `error`

**Monitoring executions:**
1. The "Recent Executions" table shows pipeline run history
2. Columns: Pipeline name, Status, Rows In, Rows Out, Error messages
3. Failed runs show the error message in red

**Creating a pipeline via API:**
```bash
curl -X POST http://localhost:3000/api/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Orders ETL",
    "description": "Extract orders from Postgres to warehouse",
    "sourceConnectorId": 1,
    "targetConnectorId": 2,
    "schedule": "0 3 * * *",
    "status": "active"
  }'
```

---

## Tool #4: Fraud & Risk Analytics

**Route**: `/tool/fraud` | **API**: `/api/fraud`

### Purpose

Detect fraud in real-time using rules, ML anomaly detection, and graph analytics. Monitor transactions, manage alerts, and simulate risk scenarios.

### How It Works

1. **Transactions** are ingested with amount, channel, location, and account info
2. **Fraud Rules** evaluate each transaction (e.g., amount > 100,000 KES)
3. **Risk Scores** (0-100) are assigned combining rule, ML, and graph signals
4. **Fraud Alerts** are generated for suspicious transactions
5. **Simulations** model "what-if" fraud scenarios

### Database Tables

| Table | Purpose |
|-------|---------|
| `transactions` | Transaction records with risk scores |
| `fraud_rules` | Configurable detection rules |
| `fraud_alerts` | Alerts from rule/ML/graph detections |
| `risk_simulations` | What-if scenario parameters and results |

### Usage

**Viewing transactions:**
1. Navigate to `/tool/fraud`
2. The "Recent Transactions" table shows amount, channel, location, risk score
3. Transactions are flagged as "Fraud" (red) or "Clean" (green)
4. Risk scores color-coded: >70 red, 40-70 yellow, <40 green

**Managing fraud rules:**
1. The "Fraud Rules" section shows all configured rules
2. Each rule shows: name, description, severity, active status, trigger count
3. Default rules:
   - **Large Transaction**: Amount > 100,000 KES
   - **Rapid Transactions**: Multiple in < 1 minute
   - **Location Mismatch**: Location differs from account
   - **New Account Large Amount**: Large tx on account < 7 days old

**Viewing alerts:**
1. The "Active Alerts" table shows open fraud alerts
2. Each shows: alert type, severity, status, assigned analyst

**Running a simulation via API:**
```bash
curl -X POST http://localhost:3000/api/fraud \
  -H "Content-Type: application/json" \
  -d '{
    "type": "simulation",
    "parameters": {"fraud_increase": 0.2, "region": "Nairobi"}
  }'
```

---

## Tool #5: Data Quality & Trust Scoring

**Route**: `/tool/quality` | **API**: `/api/quality`

### Purpose

Assign a measurable trust score to every dataset. Know instantly if data is reliable enough for decision-making.

### How It Works

1. **Quality Rules** define checks (completeness, accuracy, consistency, freshness)
2. **Quality Results** record pass/fail outcomes for each rule
3. **Trust Scores** aggregate results into a 0-100 score per dataset
4. **Data Incidents** track quality issues with root cause analysis

### Database Tables

| Table | Purpose |
|-------|---------|
| `quality_rules` | Rule definitions with type and threshold |
| `quality_results` | Pass/fail results with scores |
| `trust_scores` | Aggregated 0-100 scores per dataset |
| `data_incidents` | Issue tracking with severity and root cause |

### Trust Score Formula

```
Overall = (Completeness × 0.3) + (Accuracy × 0.3) + (Consistency × 0.2) + (Freshness × 0.2)
```

Each dimension is scored 0-100 independently.

### Usage

**Viewing trust scores:**
1. Navigate to `/tool/quality`
2. "Trust Scores by Dataset" shows each dataset with overall and dimensional scores
3. Visual progress bars for each dimension (completeness, accuracy, consistency, freshness)
4. Color coding: ≥90 green, 70-89 yellow, <70 red

**Checking quality rules:**
1. "Quality Rule Results" table shows each rule's pass/fail status
2. Score shown as percentage (e.g., 99.8%)
3. Statuses: `pass` (green), `warning` (yellow), `fail` (red)

**Default rules:**
- No null customer IDs (completeness)
- Amount > 0 (accuracy)
- Email format valid (accuracy)
- Data freshness within 1 hour (freshness)
- No duplicate transactions (consistency)

---

## Tool #6: Data Contract Enforcement

**Route**: `/tool/contracts` | **API**: `/api/contracts`

### Purpose

Define enforceable contracts between data producers and consumers. Prevent pipeline breakage from unexpected schema or SLA changes.

### How It Works

1. **Contracts** define expected schema, constraints, and SLAs for datasets
2. **Validations** check incoming data against contracts
3. **Alerts** are triggered when violations occur

### Database Tables

| Table | Purpose |
|-------|---------|
| `data_contracts` | Contract definitions with schema and SLAs |
| `contract_validations` | Validation results with violations |
| `contract_alerts` | Violation and SLA breach alerts |

### Usage

**Viewing contracts:**
1. Navigate to `/tool/contracts`
2. "Active Contracts" shows each contract with:
   - Name, version, dataset, owner
   - SLA badges (e.g., "freshness: 5 minutes", "volume: > 1000 records/hour")

**Checking validations:**
1. "Validation Results" shows pass/fail status per contract
2. Failed validations show violation count and details

**Default contracts:**
- **Transaction Schema v2.1**: Requires `id`, `amount` (min: 0), `customer_id`. SLA: 5 min freshness, 1000 records/hour
- **Customer Schema v1.3**: Requires `id`, `email` (unique). Owner: platform-team
- **Fraud Events Schema v1.0**: Requires `transaction_id`, `risk_score`. SLA: 1 min freshness

**Creating a contract via API:**
```bash
curl -X POST http://localhost:3000/api/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Orders Schema",
    "datasetName": "orders",
    "version": "v1.0",
    "schema": "{\"columns\": [{\"name\": \"id\", \"type\": \"integer\", \"required\": true}]}",
    "sla": "{\"freshness\": \"10 minutes\"}",
    "owner": "orders-team@company.com"
  }'
```

---

## Tool #7: Pipeline Optimizer

**Route**: `/tool/optimizer` | **API**: `/api/optimizer`

### Purpose

Analyze pipeline performance, identify inefficiencies, and suggest optimizations. Reduce execution time and infrastructure costs.

### How It Works

1. **Pipeline Metrics** track execution time, CPU, memory, row counts, and cost
2. **Query Profiles** capture individual query performance
3. **Optimization Suggestions** recommend improvements with impact analysis
4. Users accept or reject suggestions

### Database Tables

| Table | Purpose |
|-------|---------|
| `pipeline_metrics` | Performance measurements per pipeline |
| `query_profiles` | Individual query performance data |
| `optimization_suggestions` | AI recommendations with impact |

### Usage

**Viewing performance:**
1. Navigate to `/tool/optimizer`
2. "Pipeline Performance" shows execution time, CPU %, memory %, and cost per pipeline
3. Resource bars color-coded: high usage in red, normal in green

**Reviewing suggestions:**
1. "Optimization Suggestions" lists all recommendations
2. Each shows: type (indexing, partitioning, caching, query_rewrite), description, current vs expected performance, impact level, status
3. Statuses: `pending` (awaiting review), `applied` (implemented), `rejected` (declined)

**Default suggestions:**
- Add index on `customers.created_at` (high impact, 60% faster)
- Partition transactions table by month (high impact, 80% fewer rows scanned)
- Cache reference data for fraud scoring (medium impact, 40% faster)

**Applying a suggestion via API:**
```bash
curl -X POST http://localhost:3000/api/optimizer \
  -H "Content-Type: application/json" \
  -d '{"action": "apply", "suggestionId": 1}'
```

---

## Tool #8: Federated Query Engine

**Route**: `/tool/federated` | **API**: `/api/federated`

### Purpose

Query multiple data sources with a single SQL statement. No data movement, no ETL required.

### How It Works

1. **Virtual Schemas** map remote tables to local logical names (e.g., `v_customers`, `v_transactions`)
2. Users write SQL joining across virtual schemas
3. Query planner breaks queries into sub-queries per source
4. Results are aggregated and returned
5. Frequently used queries are cached

### Database Tables

| Table | Purpose |
|-------|---------|
| `virtual_schemas` | Remote table mappings |
| `federated_queries` | Query history with execution plan |
| `query_cache` | Cached results with hit count |

### Usage

**Running a federated query:**
1. Navigate to `/tool/federated`
2. In the query editor, write SQL using virtual schema names
3. Click available schema names (`v_customers`, `v_transactions`, `v_fraud_events`) to insert them
4. Click "Execute Query"

**Example queries:**
```sql
-- Join across Postgres and MongoDB
SELECT c.name, f.risk_score
FROM v_customers c
JOIN v_transactions t ON c.id = t.customer_id
JOIN v_fraud_events f ON t.id = f.transaction_id

-- Aggregation
SELECT channel, COUNT(*), AVG(amount)
FROM v_transactions
GROUP BY channel
```

**Executing via API:**
```bash
curl -X POST http://localhost:3000/api/federated \
  -H "Content-Type: application/json" \
  -d '{"queryText": "SELECT * FROM v_transactions WHERE amount > 100000", "sources": ["postgres"]}'
```

---

## Tool #9: Data Drift & Model Monitoring

**Route**: `/tool/drift` | **API**: `/api/drift`

### Purpose

Monitor ML models in production. Detect when input data distributions change or model accuracy degrades.

### How It Works

1. **ML Models** are registered with their features and type
2. **Model Performance** metrics are tracked over time (accuracy, precision, recall, F1, AUC-ROC)
3. **Drift Events** are detected using statistical tests (KS test p-values)
4. Alerts fire when drift exceeds thresholds

### Database Tables

| Table | Purpose |
|-------|---------|
| `ml_models` | Model registry with features and status |
| `model_performance` | Time-series performance metrics |
| `drift_events` | Detected drift with p-values and magnitude |
| `drift_alerts` | Drift notifications |

### Usage

**Viewing model health:**
1. Navigate to `/tool/drift`
2. "Model Health" shows each model with latest performance metrics
3. Metrics displayed: Accuracy, Precision, Recall, F1, AUC-ROC (as percentages)
4. Color coding: ≥90 green, 75-89 yellow, <75 red

**Reviewing drift events:**
1. "Drift Detection" table shows all detected drifts
2. Each shows: model name, drift type (feature/concept), affected feature, p-value, magnitude, severity, status
3. p-value < 0.05 indicates statistically significant drift (shown in red)

**Default models:**
| Model | Type | Features | Status |
|-------|------|----------|--------|
| Fraud Detection v2 | classification | amount, channel, location, account_age, velocity | active |
| Churn Prediction | classification | login_frequency, transaction_count, support_tickets, tenure | active |
| Transaction Anomaly | anomaly_detection | amount, time_of_day, merchant_category | degraded |

**Acknowledging a drift event:**
```bash
curl -X POST http://localhost:3000/api/drift \
  -H "Content-Type: application/json" \
  -d '{"action": "acknowledge", "driftId": 1}'
```

---

## Tool #10: Executive AI Decision Engine

**Route**: `/tool/executive` | **API**: `/api/executive`

### Purpose

Aggregate all platform metrics into executive dashboards. Provide AI-driven recommendations and scenario simulations.

### How It Works

1. **KPI Metrics** aggregate key numbers from all tools
2. **AI Recommendations** suggest actions based on data patterns
3. **Scenarios** model "what-if" situations with predicted outcomes
4. **Executive Alerts** surface critical issues from across the platform

### Database Tables

| Table | Purpose |
|-------|---------|
| `kpi_metrics` | Key performance indicators with trends |
| `ai_recommendations` | AI-generated action suggestions |
| `scenarios` | What-if simulations with predicted outcomes |
| `executive_alerts` | Critical alerts aggregated from all tools |

### Usage

**Viewing KPIs:**
1. Navigate to `/tool/executive`
2. Top section shows 8 KPI cards with:
   - Current value, unit, trend indicator (↑↓→)
   - Percentage change vs previous period
3. KPIs include: Revenue, Fraud Loss Rate, Pipeline Uptime, Data Quality Score, Infrastructure Cost, Active Users, ML Accuracy, Query Response Time

**Reviewing recommendations:**
1. "AI Recommendations" section shows pending suggestions
2. Each shows: title, description, category (cost/revenue/risk/operational), confidence %, impact level
3. Categories color-coded: cost (amber), risk (red), revenue (green), operational (blue)

**Running scenarios:**
1. "Scenario Simulations" shows pre-configured what-if analyses
2. Each scenario shows input parameters and predicted outcomes
3. Example scenarios:
   - "Fraud Spike +20%" → projected losses, detection rate change
   - "Infrastructure Cost Reduction" → savings from spot instances
   - "User Growth +50%" → infrastructure impact, latency increase

**Managing alerts:**
1. "Executive Alerts" shows critical notifications from all tools
2. Each shows: title, message, severity, source tool, status

**Accepting a recommendation:**
```bash
curl -X POST http://localhost:3000/api/executive \
  -H "Content-Type: application/json" \
  -d '{"action": "accept_recommendation", "recommendationId": 1}'
```

---

## Unified Dashboard

**Route**: `/dashboard`

The dashboard aggregates all 10 tools into a single view:

- **Tool Cards**: Each tool shows key metrics at a glance
- **Quick Access**: Direct links to frequently used features
- **Platform Health**: Overall scores for data quality, pipeline health, ML model health, contract compliance

Navigation: The left sidebar provides access to all tools at any time.
