import { NextResponse } from "next/server";
import { db } from "@/db";
import { dataAssets, lineageEdges, pipelineRuns, observabilityMetrics } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const assets = await db.select().from(dataAssets).orderBy(desc(dataAssets.createdAt)).limit(500);
    const edges = await db.select().from(lineageEdges).limit(1000);
    const recentRuns = await db.select().from(pipelineRuns).orderBy(desc(pipelineRuns.createdAt)).limit(10);
    const metrics = await db.select().from(observabilityMetrics).orderBy(desc(observabilityMetrics.recordedAt)).limit(100);

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
    console.error("[API/lineage] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lineage data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required field: name" },
        { status: 400 }
      );
    }

    if (!body.type || typeof body.type !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required field: type" },
        { status: 400 }
      );
    }

    if (!body.source || typeof body.source !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required field: source" },
        { status: 400 }
      );
    }

    const result = await db.insert(dataAssets).values({
      name: body.name,
      type: body.type,
      source: body.source,
      schema: body.schema ? JSON.stringify(body.schema) : null,
      status: body.status || "active",
    }).returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error("[API/lineage] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create data asset" },
      { status: 500 }
    );
  }
}
