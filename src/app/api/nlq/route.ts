import { NextResponse } from "next/server";
import { db } from "@/db";
import { nlqQueries, semanticMappings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const queries = await db.select().from(nlqQueries).orderBy(desc(nlqQueries.createdAt)).limit(100);
    const mappings = await db.select().from(semanticMappings).limit(200);
    return NextResponse.json({ success: true, data: { queries, mappings } });
  } catch (error) {
    console.error("[API/nlq] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch NLQ data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "query") {
      if (!body.naturalLanguage || typeof body.naturalLanguage !== "string") {
        return NextResponse.json(
          { success: false, error: "Missing required field: naturalLanguage" },
          { status: 400 }
        );
      }

      const dataset = typeof body.dataset === "string" && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(body.dataset)
        ? body.dataset
        : "transactions";

      const result = await db.insert(nlqQueries).values({
        naturalLanguage: body.naturalLanguage,
        generatedSql: `SELECT * FROM ${dataset} LIMIT 100`,
        chartType: "table",
        executionTime: 0,
        success: true,
      }).returning();
      return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
    }

    if (body.action === "feedback") {
      if (!body.queryId || typeof body.queryId !== "number") {
        return NextResponse.json(
          { success: false, error: "Missing required field: queryId" },
          { status: 400 }
        );
      }
      if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
        return NextResponse.json(
          { success: false, error: "Invalid rating: must be a number between 1 and 5" },
          { status: 400 }
        );
      }
      await db.update(nlqQueries)
        .set({ feedbackRating: body.rating })
        .where(eq(nlqQueries.id, body.queryId));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[API/nlq] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process NLQ request" },
      { status: 500 }
    );
  }
}
