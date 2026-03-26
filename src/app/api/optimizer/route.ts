import { NextResponse } from "next/server";
import { db } from "@/db";
import { pipelineMetrics, optimizationSuggestions, queryProfiles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const metrics = await db.select().from(pipelineMetrics).orderBy(desc(pipelineMetrics.recordedAt)).limit(100);
    const suggestions = await db.select().from(optimizationSuggestions).orderBy(desc(optimizationSuggestions.createdAt)).limit(100);
    const profiles = await db.select().from(queryProfiles).orderBy(desc(queryProfiles.recordedAt)).limit(100);
    return NextResponse.json({ success: true, data: { metrics, suggestions, profiles } });
  } catch (error) {
    console.error("[API/optimizer] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch optimizer data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "apply") {
      if (!body.suggestionId || typeof body.suggestionId !== "number") {
        return NextResponse.json(
          { success: false, error: "Missing required field: suggestionId" },
          { status: 400 }
        );
      }
      await db.update(optimizationSuggestions)
        .set({ status: "applied", appliedAt: new Date() })
        .where(eq(optimizationSuggestions.id, body.suggestionId));
      return NextResponse.json({ success: true });
    }

    if (body.action === "reject") {
      if (!body.suggestionId || typeof body.suggestionId !== "number") {
        return NextResponse.json(
          { success: false, error: "Missing required field: suggestionId" },
          { status: 400 }
        );
      }
      await db.update(optimizationSuggestions)
        .set({ status: "rejected" })
        .where(eq(optimizationSuggestions.id, body.suggestionId));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[API/optimizer] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process optimizer request" },
      { status: 500 }
    );
  }
}
