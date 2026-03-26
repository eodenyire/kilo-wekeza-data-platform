import { NextResponse } from "next/server";
import { db } from "@/db";
import { qualityRules, qualityResults, trustScores, dataIncidents } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rules = await db.select().from(qualityRules);
    const results = await db.select().from(qualityResults).orderBy(desc(qualityResults.recordedAt));
    const scores = await db.select().from(trustScores).orderBy(desc(trustScores.recordedAt));
    const incidents = await db.select().from(dataIncidents).orderBy(desc(dataIncidents.createdAt));
    return NextResponse.json({ success: true, data: { rules, results, scores, incidents } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
