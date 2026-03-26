# Wekeza Data Platform

**From Data Silos to Global Intelligence**

An end-to-end enterprise data platform that connects, monitors, optimizes, and delivers AI-driven insights across all data systems. Built with 10 integrated tools covering the complete data lifecycle — from ingestion to executive decision-making.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [The 10 Tools](#the-10-tools)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Roadmap](#roadmap)

---

## Overview

Wekeza Data Platform solves a universal enterprise problem: **data is everywhere, but insight is nowhere**. Organizations run Postgres, MongoDB, Kafka, Snowflake, and dozens of APIs — yet have no unified view of their data, no automated quality checks, and no way to trust the numbers on their dashboards.

Wekeza provides 10 tightly integrated tools that work together as a single platform:

| Layer | Tools | Purpose |
|-------|-------|---------|
| **Ingestion** | Pipeline Builder, Pipeline Optimizer | Build and auto-tune data pipelines |
| **Governance** | Lineage, Data Quality, Contracts | Track, measure, and enforce data reliability |
| **Analytics** | NLQ Engine, Federated Queries | Query anything in plain English or SQL |
| **ML & Risk** | Fraud Analytics, Drift Monitor | Detect fraud and monitor model health |
| **Intelligence** | Executive AI | AI recommendations and scenario simulations |

### Key Differentiators

- **End-to-end coverage**: From raw data ingestion to executive AI decisions
- **Unified platform**: All 10 tools share a single database and navigation
- **Real-time ready**: Designed for streaming data and live dashboards
- **Open architecture**: Every tool has a REST API for integration
- **Trust-first**: Data quality scoring built into every layer

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Executive AI (#10)                    │
│              KPIs · Recommendations · Scenarios         │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│ Lineage  │ Quality  │ Contracts│ Optimizer│  Drift     │
│   (#1)   │   (#5)   │   (#6)   │   (#7)   │   (#9)    │
├──────────┴──────────┴──────────┴──────────┴────────────┤
│           NLQ Engine (#2) · Federated (#8)             │
│              Query anything, anywhere                   │
├─────────────────────────────────────────────────────────┤
│        Pipeline Builder (#3) · Fraud Analytics (#4)    │
│            Ingest, transform, detect risk               │
├─────────────────────────────────────────────────────────┤
│              SQLite Database (35 tables)                │
│                  Drizzle ORM                            │
├─────────────────────────────────────────────────────────┤
│    Next.js 16 · React 19 · TypeScript · Tailwind 4     │
└─────────────────────────────────────────────────────────┘
```

For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) installed
- Node.js 20+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd wekeza-data-platform

# Install dependencies
bun install

# Generate database migrations
bun db:generate

# Start development server
bun dev
```

The application runs at **http://localhost:3000**.

### First Steps

1. Open `http://localhost:3000` — you'll see the landing page
2. Click **"View Investor Pitch Deck"** for the 14-slide presentation
3. Navigate to `/dashboard` for the unified tool interface
4. Click any tool in the left sidebar to explore

### Available Commands

```bash
bun dev              # Start dev server (http://localhost:3000)
bun run build        # Production build
bun start            # Start production server
bun lint             # Run ESLint
bun typecheck        # Run TypeScript type checking
bun db:generate      # Generate Drizzle migrations
bun db:migrate       # Run migrations
bun db:seed          # Seed demo data
```

---

## The 10 Tools

### Tool #1 — Data Lineage & Observability Engine

**URL**: `/tool/lineage` | **API**: `/api/lineage`

Track every data asset across your organization. Visualize how data flows from source to destination, monitor freshness and volume, detect broken pipelines.

- Auto-discover tables, views, streams, and files across Postgres, MongoDB, Kafka
- Build lineage graphs showing source → transformation → destination
- Monitor observability metrics: freshness, volume, latency, error rate
- Detect schema drift and orphan tables

---

### Tool #2 — Natural Language Query Engine

**URL**: `/tool/nlq` | **API**: `/api/nlq`

Ask questions in plain English, get SQL and insights. Non-technical users can query data without writing code.

- Type natural language queries (e.g., "Show fraud trends in Nairobi last 6 months")
- Automatic SQL generation with chart type selection
- Semantic layer mapping business terms to database columns
- Query history with feedback ratings for continuous improvement

---

### Tool #3 — Data Integration Platform

**URL**: `/tool/pipeline` | **API**: `/api/pipeline`

Connect any data source, build pipelines visually, schedule and monitor execution.

- Pluggable connectors: Postgres, MongoDB, Kafka, APIs, CSV, Oracle
- Pipeline configuration with cron scheduling
- Execution history with row counts and error tracking
- Batch and streaming execution modes

---

### Tool #4 — Fraud & Risk Analytics

**URL**: `/tool/fraud` | **API**: `/api/fraud`

Real-time fraud detection combining rules, ML, and graph analytics.

- Transaction monitoring with risk scoring (0-100)
- Configurable fraud rules (large amounts, rapid transactions, location mismatch)
- Detection methods: rule-based, ML anomaly, graph pattern
- Alert management with severity levels and assignment

---

### Tool #5 — Data Quality & Trust Scoring

**URL**: `/tool/quality` | **API**: `/api/quality`

Assign a credit-score-like trust rating to every dataset. Know instantly if data is reliable.

- Trust scores (0-100) per dataset broken down by:
  - **Completeness**: Are there null values?
  - **Accuracy**: Do values match expected ranges?
  - **Consistency**: Is data consistent across systems?
  - **Freshness**: Is data within SLA?
- Quality rules with pass/fail results
- Incident tracking with root cause analysis

---

### Tool #6 — Data Contract Enforcement

**URL**: `/tool/contracts` | **API**: `/api/contracts`

Define contracts between data producers and consumers. Enforce schemas, SLAs, and constraints.

- Contract definition with schema, constraints, and SLAs
- Version control (Git-style) for contract evolution
- Validation engine that checks data against contracts
- Alerts for violations, SLA breaches, and schema changes

---

### Tool #7 — Pipeline Optimizer

**URL**: `/tool/optimizer` | **API**: `/api/optimizer`

AI-driven analysis that identifies slow queries, suggests optimizations, and auto-tunes pipelines.

- Pipeline performance metrics (execution time, CPU, memory, cost)
- Query profiling with optimization suggestions
- Suggestion types: indexing, partitioning, caching, query rewriting
- Accept/reject workflow for recommendations

---

### Tool #8 — Federated Query Engine

**URL**: `/tool/federated` | **API**: `/api/federated`

Query multiple data sources with a single SQL statement. No data movement required.

- Virtual schema layer abstracting multiple databases
- Cross-database joins (e.g., Postgres customers JOIN MongoDB transactions)
- Query result caching for performance
- Query execution plan and source tracking

---

### Tool #9 — Data Drift & Model Monitoring

**URL**: `/tool/drift` | **API**: `/api/drift`

Monitor ML models in production. Detect when data distributions shift or model accuracy degrades.

- Model health dashboard with accuracy, precision, recall, F1, AUC-ROC
- Drift detection: feature drift, concept drift, prediction drift
- Statistical significance testing (p-values)
- Severity classification and alerting

---

### Tool #10 — Executive AI Decision Engine

**URL**: `/tool/executive` | **API**: `/api/executive`

Aggregate all metrics, insights, and predictions into AI-driven executive recommendations.

- KPI dashboard with trend indicators
- AI recommendations with confidence scores and impact ratings
- Scenario simulation ("What if fraud spikes 20%?")
- Multi-source alert aggregation

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | Full-stack React framework (App Router) |
| **React 19** | UI library |
| **TypeScript 5.9** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Drizzle ORM** | Type-safe database access |
| **SQLite** | Embedded database (via @kilocode/app-builder-db) |
| **Recharts** | Data visualization |
| **Lucide React** | Icon library |
| **Bun** | Package manager and runtime |

---

## Project Structure

```
wekeza-data-platform/
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md            # System design and data flow
│   ├── TOOLS.md                   # Detailed tool documentation
│   ├── API.md                     # API reference
│   ├── DATABASE.md                # Schema and data model
│   ├── SETUP.md                   # Installation guide
│   ├── ROADMAP.md                 # Progress and milestones
│   └── CONTRIBUTING.md            # How to extend the platform
├── drizzle.config.ts              # Drizzle ORM configuration
├── src/
│   ├── db/                        # Database layer
│   │   ├── schema.ts              # 35 table definitions
│   │   ├── index.ts               # Lazy DB client
│   │   ├── migrate.ts             # Migration runner
│   │   ├── seed.ts                # Demo data seeder
│   │   └── migrations/            # Generated SQL migrations
│   ├── lib/                       # Shared utilities
│   │   ├── types.ts               # TypeScript interfaces
│   │   └── utils.ts               # Formatting, colors, helpers
│   ├── components/                # Reusable components
│   │   └── ui/
│   │       ├── Cards.tsx          # StatCard, StatusBadge, DataTable
│   │       └── ToolNav.tsx        # Sidebar navigation
│   └── app/                       # Next.js App Router
│       ├── page.tsx               # Landing page
│       ├── pitch/page.tsx         # Investor pitch deck
│       ├── dashboard/page.tsx     # Unified dashboard
│       ├── tool/                  # 10 tool UI pages
│       │   ├── lineage/
│       │   ├── nlq/
│       │   ├── pipeline/
│       │   ├── fraud/
│       │   ├── quality/
│       │   ├── contracts/
│       │   ├── optimizer/
│       │   ├── federated/
│       │   ├── drift/
│       │   └── executive/
│       └── api/                   # 10 API routes
│           ├── lineage/route.ts
│           ├── nlq/route.ts
│           ├── pipeline/route.ts
│           ├── fraud/route.ts
│           ├── quality/route.ts
│           ├── contracts/route.ts
│           ├── optimizer/route.ts
│           ├── federated/route.ts
│           ├── drift/route.ts
│           └── executive/route.ts
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design, layers, data flow, component interactions |
| [Tools](docs/TOOLS.md) | Detailed documentation for all 10 tools with usage examples |
| [API Reference](docs/API.md) | Complete REST API documentation for all endpoints |
| [Database](docs/DATABASE.md) | Schema documentation, table relationships, data model |
| [Setup Guide](docs/SETUP.md) | Installation, configuration, environment setup |
| [Roadmap](docs/ROADMAP.md) | Progress tracker, completed milestones, planned features |
| [Contributing](docs/CONTRIBUTING.md) | How to add tools, extend functionality, coding standards |

---

## License

Proprietary — Wekeza Data Platform
