import { NextResponse } from "next/server";
import { db } from "@/db";
import { qualityRules, qualityResults, trustScores, dataIncidents } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rules = await db.select().from(qualityRules).limit(200);
    const results = await db.select().from(qualityResults).orderBy(desc(qualityResults.recordedAt)).limit(200);
    const scores = await db.select().from(trustScores).orderBy(desc(trustScores.recordedAt)).limit(100);
    const incidents = await db.select().from(dataIncidents).orderBy(desc(dataIncidents.createdAt)).limit(50);
    return NextResponse.json({ success: true, data: { rules, results, scores, incidents } });
  } catch (error) {
    console.error("[API/quality] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quality data" },
      { status: 500 }
    );
  }
}
