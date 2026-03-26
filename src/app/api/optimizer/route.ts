import { NextResponse } from "next/server";
import { db } from "@/db";
import { pipelineMetrics, optimizationSuggestions, queryProfiles } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const metrics = await db.select().from(pipelineMetrics).orderBy(desc(pipelineMetrics.recordedAt));
    const suggestions = await db.select().from(optimizationSuggestions).orderBy(desc(optimizationSuggestions.createdAt));
    const profiles = await db.select().from(queryProfiles).orderBy(desc(queryProfiles.recordedAt));
    return NextResponse.json({ success: true, data: { metrics, suggestions, profiles } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "apply") {
      await db.update(optimizationSuggestions)
        .set({ status: "applied", appliedAt: new Date() })
        .where(eq(optimizationSuggestions.id, body.suggestionId));
      return NextResponse.json({ success: true });
    }
    if (body.action === "reject") {
      await db.update(optimizationSuggestions)
        .set({ status: "rejected" })
        .where(eq(optimizationSuggestions.id, body.suggestionId));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

import { eq } from "drizzle-orm";
