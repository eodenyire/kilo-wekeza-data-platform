import { NextResponse } from "next/server";
import { db } from "@/db";
import { virtualSchemas, federatedQueries } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const schemas = await db.select().from(virtualSchemas).limit(100);
    const queries = await db.select().from(federatedQueries).orderBy(desc(federatedQueries.createdAt)).limit(100);
    return NextResponse.json({ success: true, data: { schemas, queries } });
  } catch (error) {
    console.error("[API/federated] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch federated data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.queryText || typeof body.queryText !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required field: queryText" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.sources) || body.sources.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required field: sources (non-empty array)" },
        { status: 400 }
      );
    }

    const result = await db.insert(federatedQueries).values({
      queryText: body.queryText,
      sourcesUsed: JSON.stringify(body.sources),
      executionTime: 0,
      rowsReturned: 0,
      cached: false,
    }).returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error("[API/federated] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create federated query" },
      { status: 500 }
    );
  }
}
