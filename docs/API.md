# API Reference — Wekeza Data Platform

All API routes are Next.js Route Handlers. Every endpoint returns JSON in a standard format.

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-03-26T10:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message description",
  "timestamp": "2026-03-26T10:00:00.000Z"
}
```

---

## Endpoints

### GET /api/lineage

Returns all data assets, lineage edges, recent pipeline runs, and observability metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "id": 1,
        "name": "customers",
        "type": "table",
        "source": "postgres",
        "schema": "{\"columns\": [...]}",
        "rowCount": 125000,
        "status": "active",
        "createdAt": "2026-03-26T10:00:00.000Z"
      }
    ],
    "edges": [
      {
        "id": 1,
        "sourceId": 1,
        "targetId": 2,
        "transformationType": "reference"
      }
    ],
    "recentRuns": [...],
    "metrics": [...],
    "assetsBySource": [
      { "source": "postgres", "count": 5 }
    ]
  }
}
```

### POST /api/lineage

Create a new data asset.

**Body:**
```json
{
  "name": "orders",
  "type": "table",
  "source": "postgres",
  "schema": "{\"columns\": [{\"name\": \"id\", \"type\": \"integer\"}]}",
  "rowCount": 50000
}
```

---

### GET /api/nlq

Returns all NLQ queries and semantic mappings.

**Response:**
```json
{
  "success": true,
  "data": {
    "queries": [
      {
        "id": 1,
        "naturalLanguage": "Show fraud trends in Nairobi last 6 months",
        "generatedSql": "SELECT DATE_TRUNC('month', timestamp)...",
        "chartType": "line",
        "executionTime": 1.2,
        "success": true,
        "feedbackRating": 5
      }
    ],
    "mappings": [
      {
        "id": 1,
        "businessTerm": "Customers",
        "databaseTable": "customers",
        "databaseColumn": "*",
        "description": "All registered customers"
      }
    ]
  }
}
```

### POST /api/nlq

Generate SQL from natural language or submit feedback.

**Body (generate):**
```json
{
  "action": "query",
  "naturalLanguage": "Show top customers by revenue"
}
```

**Body (feedback):**
```json
{
  "action": "feedback",
  "queryId": 1,
  "rating": 5
}
```

---

### GET /api/pipeline

Returns all connectors, pipelines, and recent executions.

**Response:**
```json
{
  "success": true,
  "data": {
    "connectors": [
      {
        "id": 1,
        "name": "Production Postgres",
        "type": "postgres",
        "status": "active"
      }
    ],
    "pipelines": [
      {
        "id": 1,
        "name": "Customer ETL",
        "description": "Daily customer data extraction",
        "sourceConnectorId": 1,
        "targetConnectorId": 1,
        "schedule": "0 2 * * *",
        "status": "active"
      }
    ],
    "executions": [
      {
        "id": 1,
        "pipelineId": 1,
        "status": "success",
        "rowsIn": 125000,
        "rowsOut": 125000,
        "errorMessage": null
      }
    ]
  }
}
```

### POST /api/pipeline

Create a new pipeline.

**Body:**
```json
{
  "name": "Daily Orders ETL",
  "description": "Extract orders from Postgres",
  "sourceConnectorId": 1,
  "targetConnectorId": 2,
  "schedule": "0 3 * * *",
  "status": "active"
}
```

---

### GET /api/fraud

Returns transactions, fraud rules, alerts, and aggregated stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "rules": [...],
    "alerts": [...],
    "stats": {
      "totalTransactions": 5,
      "fraudDetected": 3,
      "avgRiskScore": 55.0
    }
  }
}
```

### POST /api/fraud

Create a fraud rule or run a simulation.

**Body (rule):**
```json
{
  "type": "rule",
  "name": "Night Large Transaction",
  "description": "Large transactions during night hours",
  "condition": "{\"field\": \"amount\", \"operator\": \">\", \"value\": 50000}",
  "severity": "high"
}
```

**Body (simulation):**
```json
{
  "type": "simulation",
  "parameters": {
    "fraud_increase": 0.2,
    "region": "Nairobi"
  }
}
```

---

### GET /api/quality

Returns quality rules, results, trust scores, and incidents.

**Response:**
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": 1,
        "name": "No null customer IDs",
        "datasetName": "transactions",
        "ruleType": "completeness",
        "threshold": 0.99
      }
    ],
    "results": [...],
    "scores": [
      {
        "id": 1,
        "datasetName": "customers",
        "overallScore": 94,
        "completenessScore": 98,
        "accuracyScore": 92,
        "consistencyScore": 95,
        "freshnessScore": 90
      }
    ],
    "incidents": [...]
  }
}
```

---

### GET /api/contracts

Returns contracts, validations, and alerts.

**Response:**
```json
{
  "success": true,
  "data": {
    "contracts": [
      {
        "id": 1,
        "name": "Transaction Schema",
        "datasetName": "transactions",
        "version": "v2.1",
        "schema": "{\"columns\": [...]}",
        "sla": "{\"freshness\": \"5 minutes\"}",
        "owner": "data-team@wekeza.com",
        "status": "active"
      }
    ],
    "validations": [...],
    "alerts": [...]
  }
}
```

### POST /api/contracts

Create a new data contract.

**Body:**
```json
{
  "name": "Orders Schema",
  "datasetName": "orders",
  "version": "v1.0",
  "schema": "{\"columns\": [{\"name\": \"id\", \"type\": \"integer\", \"required\": true}]}",
  "sla": "{\"freshness\": \"10 minutes\", \"volume\": \"> 500/hour\"}",
  "owner": "orders-team@company.com",
  "status": "active"
}
```

---

### GET /api/optimizer

Returns pipeline metrics, query profiles, and optimization suggestions.

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "id": 1,
        "pipelineId": 1,
        "executionTime": 900,
        "cpuUsage": 65,
        "memoryUsage": 40,
        "rowsProcessed": 125000,
        "costEstimate": 2.5
      }
    ],
    "suggestions": [...],
    "profiles": [...]
  }
}
```

### POST /api/optimizer

Apply or reject an optimization suggestion.

**Body (apply):**
```json
{
  "action": "apply",
  "suggestionId": 1
}
```

**Body (reject):**
```json
{
  "action": "reject",
  "suggestionId": 1
}
```

---

### GET /api/federated

Returns virtual schemas and query history.

**Response:**
```json
{
  "success": true,
  "data": {
    "schemas": [
      {
        "id": 1,
        "name": "v_customers",
        "sourceConnectorId": 1,
        "remoteTable": "customers"
      }
    ],
    "queries": [...]
  }
}
```

### POST /api/federated

Execute a federated query.

**Body:**
```json
{
  "queryText": "SELECT * FROM v_transactions WHERE amount > 100000",
  "sources": ["postgres"]
}
```

---

### GET /api/drift

Returns ML models, performance metrics, drift events, and alerts.

**Response:**
```json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": 1,
        "name": "Fraud Detection v2",
        "version": "v2.1",
        "type": "classification",
        "features": "[\"amount\", \"channel\", \"location\"]",
        "status": "active"
      }
    ],
    "performance": [...],
    "drifts": [...],
    "alerts": [...]
  }
}
```

### POST /api/drift

Acknowledge a drift event.

**Body:**
```json
{
  "action": "acknowledge",
  "driftId": 1
}
```

---

### GET /api/executive

Returns KPIs, AI recommendations, scenarios, and executive alerts.

**Response:**
```json
{
  "success": true,
  "data": {
    "kpis": [
      {
        "id": 1,
        "name": "Total Revenue",
        "category": "revenue",
        "value": 12500000,
        "previousValue": 11800000,
        "unit": "KES",
        "trend": "up"
      }
    ],
    "recommendations": [...],
    "scenarios": [...],
    "alerts": [...]
  }
}
```

### POST /api/executive

Accept/reject recommendations or dismiss alerts.

**Body (accept):**
```json
{
  "action": "accept_recommendation",
  "recommendationId": 1
}
```

**Body (reject):**
```json
{
  "action": "reject_recommendation",
  "recommendationId": 1
}
```

**Body (dismiss alert):**
```json
{
  "action": "dismiss_alert",
  "alertId": 1
}
```

---

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad request (invalid body or action) |
| 500 | Internal server error (database or logic error) |

All errors include `"success": false` and an `"error"` field in the response body.
