import { NextResponse } from "next/server";
import { db } from "@/db";
import { dataAssets, lineageEdges, pipelineRuns, observabilityMetrics } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const assets = await db.select().from(dataAssets).orderBy(desc(dataAssets.createdAt));
    const edges = await db.select().from(lineageEdges);
    const recentRuns = await db.select().from(pipelineRuns).orderBy(desc(pipelineRuns.createdAt)).limit(10);
    const metrics = await db.select().from(observabilityMetrics).orderBy(desc(observabilityMetrics.recordedAt));

    const assetsBySource = await db
      .select({ source: dataAssets.source, count: sql<number>`count(*)` })
      .from(dataAssets)
      .groupBy(dataAssets.source);

    return NextResponse.json({
      success: true,
      data: { assets, edges, recentRuns, metrics, assetsBySource },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(dataAssets).values(body).returning();
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
