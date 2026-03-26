# Architecture — Wekeza Data Platform

## System Overview

Wekeza is built as a **monolithic Next.js application** with a clear layered architecture. Each tool is a self-contained module with its own database tables, API route, and UI page — but all share a common navigation, authentication, and data layer.

## Architectural Principles

1. **Unified Database**: All 10 tools share a single SQLite database (35 tables). No data silos between tools.
2. **API-First**: Every tool exposes a REST API (`/api/*`) that can be consumed by the UI, external systems, or future mobile apps.
3. **Lazy Initialization**: Database connections are lazily initialized to support build-time static generation.
4. **Component Reuse**: Shared UI components (`StatCard`, `StatusBadge`, `DataTable`, `PageHeader`) ensure visual consistency.
5. **Progressive Enhancement**: Each tool works independently but gains value when combined with others.

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Dashboard │ │ Tool UIs │ │  Pitch   │ │ Landing  │          │
│  │  Page    │ │(10 pages)│ │  Deck    │ │  Page    │          │
│  └────┬─────┘ └────┬─────┘ └──────────┘ └──────────┘          │
│       │             │                                           │
│  ┌────┴─────────────┴──────────────────────────────────┐       │
│  │            Shared Components Layer                   │       │
│  │  ToolNav · Cards · StatusBadge · DataTable           │       │
│  └────────────────────────┬────────────────────────────┘       │
├───────────────────────────┼─────────────────────────────────────┤
│                     API LAYER                                   │
│  ┌────────────────────────┴────────────────────────────┐       │
│  │           Next.js API Routes (10 endpoints)         │       │
│  │  GET: fetch data  |  POST: create/update/actions    │       │
│  └────────────────────────┬────────────────────────────┘       │
├───────────────────────────┼─────────────────────────────────────┤
│                   DATA ACCESS LAYER                             │
│  ┌────────────────────────┴────────────────────────────┐       │
│  │              Drizzle ORM + SQLite                    │       │
│  │  35 tables · Type-safe queries · Lazy connection     │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tool Interconnection Map

The 10 tools are designed to work together. Here's how they connect:

```
                    ┌──────────────┐
                    │  Executive   │
                    │     AI       │ ← Aggregates from all tools
                    │    (#10)     │
                    └──────┬───────┘
                           │ reads KPIs from
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────┴─────┐     ┌─────┴─────┐     ┌─────┴─────┐
  │   Drift   │     │  Quality  │     │  Fraud    │
  │   (#9)    │     │   (#5)    │     │   (#4)    │
  └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
        │                 │                  │
        │           ┌─────┴─────┐            │
        │           │ Contracts │            │
        │           │   (#6)    │            │
        │           └─────┬─────┘            │
        │                 │                  │
  ┌─────┴─────────────────┴──────────────────┴─────┐
  │              Lineage (#1)                       │
  │         Tracks data flow across all tools       │
  └─────────────────────┬───────────────────────────┘
                        │
  ┌─────────────────────┴───────────────────────────┐
  │        Pipelines (#3) + Optimizer (#7)          │
  │        Build and auto-tune data pipelines       │
  └─────────────────────┬───────────────────────────┘
                        │
  ┌─────────────────────┴───────────────────────────┐
  │      NLQ (#2) + Federated Queries (#8)          │
  │        Query anything in English or SQL         │
  └─────────────────────────────────────────────────┘
```

### Key Integration Points

| Source Tool | Target Tool | Integration |
|------------|-------------|-------------|
| Lineage (#1) | Quality (#5) | Bad data in lineage triggers quality incidents |
| Quality (#5) | Contracts (#6) | Quality rules can be derived from contracts |
| Contracts (#6) | Pipelines (#3) | Contracts validate pipeline outputs |
| Pipelines (#3) | Optimizer (#7) | Optimizer analyzes pipeline metrics |
| Pipelines (#3) | Lineage (#1) | Pipeline runs populate lineage edges |
| Drift (#9) | Quality (#5) | Data drift detected by quality checks |
| All tools | Executive (#10) | Executive aggregates metrics from all tools |

---

## Data Flow

### Ingestion Flow

```
External Source → Connector → Pipeline → Validation → Storage
                                │             │
                          Optimizer (#7)   Contracts (#6)
                                │             │
                          suggestions      pass/fail
```

### Query Flow

```
User Input → NLQ (#2) → Semantic Layer → SQL Generation → Federated (#8)
                                                              │
                                                     Virtual Schema Layer
                                                              │
                                                    ┌─────────┼─────────┐
                                                    │         │         │
                                                 Postgres  MongoDB    API
```

### Monitoring Flow

```
Pipeline Runs → Lineage (#1) → Observability Metrics → Quality (#5) → Trust Scores
                    │                                                       │
               Drift (#9)                                          Executive (#10)
                    │                                                       │
            Model Performance                                    KPIs + Alerts
```

---

## Component Architecture

### Shared Components

```
src/components/
├── ui/
│   ├── Cards.tsx          # StatCard, StatusBadge, SeverityBadge, DataTable, PageHeader, EmptyState
│   └── ToolNav.tsx        # Sidebar navigation, ToolLayout wrapper
```

### Page Structure (each tool follows this pattern)

```
src/app/tool/[name]/
└── page.tsx               # "use client" component
    ├── useEffect → fetch(/api/[name])
    ├── loading state
    ├── StatCard row (summary metrics)
    ├── DataTable sections (data display)
    └── Interactive elements (inputs, buttons)
```

### API Route Structure (each endpoint follows this pattern)

```
src/app/api/[name]/
└── route.ts
    ├── GET handler → query DB → return JSON
    └── POST handler → validate → update DB → return JSON
```

---

## Security Model

Currently the platform uses a **single-tenant model** with no authentication. For production deployment:

| Concern | Current | Production Target |
|---------|---------|-------------------|
| Authentication | None | OAuth2 / JWT |
| Authorization | None | RBAC (role-based) |
| API Security | Open | API keys + rate limiting |
| Data Encryption | None | TLS + at-rest encryption |
| Audit Logging | None | Full audit trail |

---

## Performance Considerations

| Aspect | Strategy |
|--------|----------|
| Database | SQLite for development; migrate to Postgres for production |
| Build | Lazy DB initialization prevents build-time errors |
| Caching | Query result caching in Federated Engine (#8) |
| Bundle | Next.js automatic code splitting per route |
| Rendering | Server Components by default; `"use client"` only where needed |

---

## Deployment Architecture

```
                    ┌──────────────┐
                    │   CDN/Edge   │
                    │  (Vercel/    │
                    │   AWS)       │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │  Next.js App │
                    │  (SSR + API) │
                    └──────┬───────┘
                           │
                    ┌──────┴───────┐
                    │   Database   │
                    │  (SQLite →   │
                    │   Postgres)  │
                    └──────────────┘
```

For production, the recommended deployment is:
- **Frontend + API**: Vercel or AWS (Next.js native support)
- **Database**: Managed Postgres (Supabase, Neon, or AWS RDS)
- **Monitoring**: Sentry for errors, Datadog for metrics
