import { NextResponse } from "next/server";
import { db } from "@/db";
import { nlqQueries, semanticMappings } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const queries = await db.select().from(nlqQueries).orderBy(desc(nlqQueries.createdAt));
    const mappings = await db.select().from(semanticMappings);
    return NextResponse.json({ success: true, data: { queries, mappings } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "query") {
      const sqlTemplates: Record<string, string> = {
        default: `SELECT * FROM ${body.dataset || "transactions"} LIMIT 100`,
      };
      const result = await db.insert(nlqQueries).values({
        naturalLanguage: body.naturalLanguage,
        generatedSql: sqlTemplates.default,
        chartType: "table",
        executionTime: Math.random() * 3,
        success: true,
      }).returning();
      return NextResponse.json({ success: true, data: result[0] });
    }
    if (body.action === "feedback") {
      await db.update(nlqQueries)
        .set({ feedbackRating: body.rating })
        .where(eq(nlqQueries.id, body.queryId));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

import { eq } from "drizzle-orm";
