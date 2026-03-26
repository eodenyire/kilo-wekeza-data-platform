import { NextResponse } from "next/server";
import { db } from "@/db";
import { pipelines, pipelineExecutions } from "@/db/schema";
import { connectors } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allConnectors = await db.select().from(connectors).limit(100);
    const allPipelines = await db.select().from(pipelines).limit(100);
    const executions = await db.select().from(pipelineExecutions).orderBy(desc(pipelineExecutions.createdAt)).limit(20);
    return NextResponse.json({ success: true, data: { connectors: allConnectors, pipelines: allPipelines, executions } });
  } catch (error) {
    console.error("[API/pipeline] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pipeline data" },
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

    const result = await db.insert(pipelines).values({
      name: body.name,
      description: body.description || null,
      sourceConnectorId: body.sourceConnectorId || null,
      targetConnectorId: body.targetConnectorId || null,
      schedule: body.schedule || null,
      config: body.config ? JSON.stringify(body.config) : null,
      status: body.status || "draft",
    }).returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error("[API/pipeline] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create pipeline" },
      { status: 500 }
    );
  }
}
