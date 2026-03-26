import { NextResponse } from "next/server";
import { db } from "@/db";
import { virtualSchemas, federatedQueries } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const schemas = await db.select().from(virtualSchemas);
    const queries = await db.select().from(federatedQueries).orderBy(desc(federatedQueries.createdAt));
    return NextResponse.json({ success: true, data: { schemas, queries } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(federatedQueries).values({
      queryText: body.queryText,
      sourcesUsed: JSON.stringify(body.sources || ["postgres"]),
      executionTime: Math.random() * 5,
      rowsReturned: Math.floor(Math.random() * 10000),
      cached: false,
    }).returning();
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
