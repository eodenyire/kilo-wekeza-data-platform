import { NextResponse } from "next/server";
import { db } from "@/db";
import { connectors, pipelines, pipelineExecutions } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allConnectors = await db.select().from(connectors);
    const allPipelines = await db.select().from(pipelines);
    const executions = await db.select().from(pipelineExecutions).orderBy(desc(pipelineExecutions.createdAt)).limit(20);
    return NextResponse.json({ success: true, data: { connectors: allConnectors, pipelines: allPipelines, executions } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(pipelines).values(body).returning();
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
