# Contributing & Extending — Wekeza Data Platform

This guide explains how to add new features, extend existing tools, and follow the project's coding standards.

---

## Adding a New Tool

### 1. Database Schema

Add tables in `src/db/schema.ts`:

```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const myNewTable = sqliteTable("my_new_table", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  status: text("status").default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});
```

Then regenerate migrations:
```bash
bun db:generate
```

### 2. API Route

Create `src/app/api/mytool/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { db } from "@/db";
import { myNewTable } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(myNewTable).orderBy(desc(myNewTable.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(myNewTable).values(body).returning();
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
```

### 3. UI Page

Create `src/app/tool/mytool/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ui/ToolNav";
import { StatCard, DataTable, PageHeader } from "@/components/ui/Cards";

export default function MyToolPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mytool")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ToolLayout currentTool="/tool/mytool">
        <div className="text-white/50">Loading...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout currentTool="/tool/mytool">
      <PageHeader title="My Tool" description="Tool description" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Items" value={data.length} color="blue" />
      </div>
      <DataTable headers={["Name", "Status"]}>
        {data.map((item: { id: number; name: string; status: string }) => (
          <tr key={item.id} className="hover:bg-white/5">
            <td className="px-4 py-3 text-white/80 text-sm">{item.name}</td>
            <td className="px-4 py-3 text-white/60 text-sm">{item.status}</td>
          </tr>
        ))}
      </DataTable>
    </ToolLayout>
  );
}
```

### 4. Navigation

Add your tool to the sidebar in `src/components/ui/ToolNav.tsx`:

```typescript
const TOOLS = [
  // ... existing tools
  { href: "/tool/mytool", label: "My Tool", icon: "🔧" },
];
```

### 5. Seed Data

Add demo data in `src/db/seed.ts`:

```typescript
await db.insert(myNewTable).values([
  { name: "Example Item 1", status: "active" },
  { name: "Example Item 2", status: "inactive" },
]);
```

---

## Adding an API Endpoint to an Existing Tool

Most tools have a `POST` handler for actions. To add a new action:

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "my_new_action") {
      // Handle the action
      const result = await doSomething(body);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
```

---

## Adding a UI Component

### Shared Components

Add reusable components to `src/components/ui/`:

```tsx
// src/components/ui/MyComponent.tsx
interface MyComponentProps {
  title: string;
  value: string | number;
}

export function MyComponent({ title, value }: MyComponentProps) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
      <div className="text-white/50 text-sm">{title}</div>
      <div className="text-white text-xl font-bold">{value}</div>
    </div>
  );
}
```

### Usage Pattern

All tool pages follow this pattern:

```
ToolLayout (sidebar + layout)
  └── PageHeader (title + description)
       ├── StatCard row (summary metrics)
       ├── DataTable sections (data display)
       └── Interactive elements (forms, buttons)
```

---

## Coding Standards

### TypeScript

- Use strict mode (`tsconfig.json` has `"strict": true`)
- Define interfaces for all data structures
- Avoid `any` — use `unknown` and type guards instead

### React

- Use `"use client"` only for interactive components (forms, buttons, state)
- Server Components by default for data display
- Fetch data in `useEffect` for client components

### Styling

- Use Tailwind CSS utility classes exclusively
- Follow the existing color palette:
  - Backgrounds: `bg-white/5`, `bg-white/10`
  - Borders: `border-white/10`
  - Text: `text-white`, `text-white/60`, `text-white/40`
  - Status colors: emerald (success), red (error), yellow (warning), blue (info)

### API Routes

- Always return `{ success: boolean, data?: T, error?: string }`
- Use `NextResponse.json()` for responses
- Wrap handlers in try/catch
- Use appropriate HTTP status codes

### Database

- Use Drizzle ORM for all queries (no raw SQL)
- Use `desc()` / `asc()` for ordering
- Use `.returning()` on inserts to get the created record
- Store JSON as text strings (parse when reading)

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `src/app/[route]/page.tsx` | `src/app/tool/lineage/page.tsx` |
| APIs | `src/app/api/[route]/route.ts` | `src/app/api/lineage/route.ts` |
| Components | `src/components/ui/[Name].tsx` | `src/components/ui/Cards.tsx` |
| Types | `src/lib/types.ts` | All interfaces in one file |
| Utils | `src/lib/utils.ts` | Formatting and helper functions |
| Schema | `src/db/schema.ts` | All 35 tables in one file |

---

## Testing Changes

Before committing:

```bash
bun typecheck     # Must pass (0 errors)
bun lint          # Must pass (0 errors, warnings OK)
bun run build     # Must succeed
```

---

## Common Patterns

### Fetching Data in a Component

```tsx
useEffect(() => {
  fetch("/api/myendpoint")
    .then((r) => r.json())
    .then((d) => {
      if (d.success) setData(d.data);
    })
    .catch((err) => console.error("Failed:", err))
    .finally(() => setLoading(false));
}, []);
```

### Submitting Data

```tsx
const handleSubmit = async () => {
  const res = await fetch("/api/myendpoint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "my_action", ...payload }),
  });
  const d = await res.json();
  if (d.success) {
    // Update local state
  }
};
```

### Adding a Status Badge

```tsx
import { StatusBadge } from "@/components/ui/Cards";

<StatusBadge status="active" />    // green
<StatusBadge status="failed" />    // red
<StatusBadge status="running" />   // blue
```

---

## Architecture Decisions

### Why SQLite?

SQLite is embedded, requires no external server, and is perfect for development and prototyping. For production, the schema is compatible with PostgreSQL via Drizzle ORM's dialect system.

### Why Lazy DB Initialization?

Next.js 16 analyzes API routes at build time. Eager database connections fail without env vars. The lazy proxy pattern defers connection until the first actual query.

### Why All Schema in One File?

Keeping all 35 tables in `src/db/schema.ts` makes cross-tool relationships visible and avoids circular import issues.

### Why JSON for Schema/Conditions?

Storing schema definitions and conditions as JSON strings provides flexibility without requiring schema migrations for every rule change.
