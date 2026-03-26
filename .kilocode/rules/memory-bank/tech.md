# Technical Context: Wekeza Data Platform

## Technology Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 16.x    | React framework with App Router |
| React        | 19.x    | UI library                      |
| TypeScript   | 5.9.x   | Type-safe JavaScript            |
| Tailwind CSS | 4.x     | Utility-first CSS               |
| Bun          | Latest  | Package manager & runtime       |
| Drizzle ORM  | 0.45.x  | Database ORM                    |
| SQLite       | —       | Database (via app-builder-db)   |
| Recharts     | 3.8.x   | Data visualization              |
| Lucide React | 1.7.x   | Icon library                    |

## Development Environment

### Commands

```bash
bun install        # Install dependencies
bun dev            # Start dev server (http://localhost:3000)
bun build          # Production build
bun start          # Start production server
bun lint           # Run ESLint
bun typecheck      # Run TypeScript type checking
bun db:generate    # Generate Drizzle migrations
bun db:migrate     # Run migrations
bun db:seed        # Seed demo data
```

## Database

- 35 tables across all 10 tools
- Schema: `src/db/schema.ts`
- Client: `src/db/index.ts`
- Migrations: `src/db/migrations/`
- Seed data: `src/db/seed.ts`
- Config: `drizzle.config.ts`

## File Structure

```
/
├── drizzle.config.ts           # Drizzle ORM config
├── src/
│   ├── db/                     # Database layer
│   │   ├── schema.ts           # 35 table definitions
│   │   ├── index.ts            # DB client
│   │   ├── migrate.ts          # Migration script
│   │   ├── seed.ts             # Demo data
│   │   └── migrations/         # Generated SQL
│   ├── lib/                    # Shared utilities
│   │   ├── types.ts            # TypeScript types
│   │   └── utils.ts            # Formatting, colors
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Cards.tsx       # StatCard, StatusBadge, DataTable
│   │   │   └── ToolNav.tsx     # Navigation sidebar
│   │   └── SlideLayout.tsx     # Pitch deck layout
│   └── app/
│       ├── page.tsx            # Landing page
│       ├── pitch/page.tsx      # Investor pitch deck
│       ├── dashboard/page.tsx  # Unified dashboard
│       ├── tool/               # 10 tool pages
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
│       └── api/                # 10 API routes
│           ├── lineage/
│           ├── nlq/
│           ├── pipeline/
│           ├── fraud/
│           ├── quality/
│           ├── contracts/
│           ├── optimizer/
│           ├── federated/
│           ├── drift/
│           └── executive/
```

## API Routes

All API routes follow the pattern:
- `GET` — Fetch data from database
- `POST` — Create records or trigger actions

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/lineage` | GET, POST | Data assets, edges, metrics |
| `/api/nlq` | GET, POST | Query generation, feedback |
| `/api/pipeline` | GET, POST | Connectors, pipelines, runs |
| `/api/fraud` | GET, POST | Transactions, rules, simulations |
| `/api/quality` | GET | Quality rules, scores, incidents |
| `/api/contracts` | GET, POST | Contracts, validations |
| `/api/optimizer` | GET, POST | Metrics, suggestions (apply/reject) |
| `/api/federated` | GET, POST | Virtual schemas, queries |
| `/api/drift` | GET, POST | ML models, drift events |
| `/api/executive` | GET, POST | KPIs, recommendations, alerts |
