# Setup Guide — Wekeza Data Platform

## Prerequisites

| Requirement | Version | Install |
|-------------|---------|---------|
| Bun | Latest | `curl -fsSL https://bun.sh/install | bash` |
| Node.js | 20+ | Via Bun or [nodejs.org](https://nodejs.org) |
| Git | Any | [git-scm.com](https://git-scm.com) |

---

## Installation

### 1. Clone the Repository

```bash
git clone <repo-url>
cd wekeza-data-platform
```

### 2. Install Dependencies

```bash
bun install
```

This installs:
- **Runtime**: Next.js, React, Drizzle ORM, Recharts, Lucide React
- **Dev**: TypeScript, Tailwind CSS, ESLint, Drizzle Kit

### 3. Generate Database Migrations

```bash
bun db:generate
```

This reads `src/db/schema.ts` (35 tables) and generates SQL migration files in `src/db/migrations/`.

### 4. Start Development Server

```bash
bun dev
```

The application runs at **http://localhost:3000**.

### 5. Seed Demo Data (Optional)

In the sandbox environment, migrations and seeding run automatically. To seed manually:

```bash
bun db:seed
```

This populates all 35 tables with realistic demo data including transactions, fraud rules, ML models, quality scores, and executive KPIs.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URL` | Yes (auto) | Database connection URL (provided by sandbox) |
| `DB_TOKEN` | Yes (auto) | Database auth token (provided by sandbox) |

In the sandbox environment, these are set automatically. For local development, the app uses the sandbox-provided database.

---

## Available Commands

```bash
# Development
bun dev              # Start dev server at http://localhost:3000

# Building
bun run build        # Create production build
bun start            # Start production server

# Code Quality
bun lint             # Run ESLint (checks code quality)
bun typecheck        # Run TypeScript type checking

# Database
bun db:generate      # Generate Drizzle migration SQL
bun db:migrate       # Run migrations (auto in sandbox)
bun db:seed          # Populate demo data
```

---

## First-Time Walkthrough

### Step 1: Open the Landing Page

Navigate to `http://localhost:3000`. You'll see the Wekeza Data Platform landing page with a link to the investor pitch deck.

### Step 2: View the Pitch Deck

Click **"View Investor Pitch Deck"** or navigate to `/pitch`. Use arrow keys or click to navigate through 14 slides.

### Step 3: Open the Dashboard

Navigate to `/dashboard`. This is your command center showing:
- Metric cards for all 10 tools
- Quick access links
- Platform health indicators

### Step 4: Explore Each Tool

Use the left sidebar to navigate between tools:

| Click | Opens |
|-------|-------|
| Lineage | Data assets, lineage graph, pipeline runs |
| NLQ Engine | Natural language query interface |
| Pipelines | Connectors and pipeline management |
| Fraud | Transaction monitoring and fraud detection |
| Quality | Trust scores and data quality rules |
| Contracts | Data contract definitions and validations |
| Optimizer | Pipeline performance and suggestions |
| Federated | Cross-database query interface |
| Drift Monitor | ML model health and drift detection |
| Executive AI | KPIs, recommendations, and scenarios |

### Step 5: Try Interactive Features

**NLQ Engine:**
1. Go to `/tool/nlq`
2. Type "Show top customers by revenue"
3. Click "Generate SQL"
4. See the generated SQL and chart type

**Federated Queries:**
1. Go to `/tool/federated`
2. In the query editor, type: `SELECT * FROM v_transactions WHERE amount > 100000`
3. Click "Execute Query"
4. See the execution time and row count

---

## Project Configuration

### Next.js (`next.config.ts`)
- App Router enabled
- Server Components by default
- API routes at `/api/*`

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- Path alias: `@/*` maps to `src/*`
- Target: ESNext

### Tailwind CSS 4 (`postcss.config.mjs`)
- Uses `@tailwindcss/postcss` plugin
- CSS-first configuration (v4 style)

### Drizzle ORM (`drizzle.config.ts`)
- SQLite dialect
- Schema: `src/db/schema.ts`
- Migrations: `src/db/migrations/`

---

## Troubleshooting

### Build fails with "Missing database configuration"

The database client is lazily initialized. If you see this error, ensure `DB_URL` and `DB_TOKEN` are set in your environment. In the sandbox, these are provided automatically.

### Pages show "Loading..." indefinitely

Check the browser console for API errors. Ensure the development server is running (`bun dev`) and the database is seeded (`bun db:seed`).

### Type check errors

Run `bun typecheck` to see detailed errors. Most issues are type mismatches in API route handlers.

### ESLint warnings

Run `bun lint` to see warnings. These are non-blocking but should be addressed.
