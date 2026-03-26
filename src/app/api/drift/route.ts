import { NextResponse } from "next/server";
import { db } from "@/db";
import { mlModels, modelPerformance, driftEvents, driftAlerts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const models = await db.select().from(mlModels);
    const performance = await db.select().from(modelPerformance).orderBy(desc(modelPerformance.recordedAt));
    const drifts = await db.select().from(driftEvents).orderBy(desc(driftEvents.createdAt));
    const alerts = await db.select().from(driftAlerts).orderBy(desc(driftAlerts.createdAt));
    return NextResponse.json({ success: true, data: { models, performance, drifts, alerts } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "acknowledge") {
      await db.update(driftEvents)
        .set({ status: "acknowledged" })
        .where(eq(driftEvents.id, body.driftId));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

import { eq } from "drizzle-orm";
