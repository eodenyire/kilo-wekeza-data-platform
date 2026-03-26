import { NextResponse } from "next/server";
import { db } from "@/db";
import { mlModels, modelPerformance, driftEvents, driftAlerts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const models = await db.select().from(mlModels).limit(100);
    const performance = await db.select().from(modelPerformance).orderBy(desc(modelPerformance.recordedAt)).limit(100);
    const drifts = await db.select().from(driftEvents).orderBy(desc(driftEvents.createdAt)).limit(100);
    const alerts = await db.select().from(driftAlerts).orderBy(desc(driftAlerts.createdAt)).limit(50);
    return NextResponse.json({ success: true, data: { models, performance, drifts, alerts } });
  } catch (error) {
    console.error("[API/drift] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch drift data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "acknowledge") {
      if (!body.driftId || typeof body.driftId !== "number") {
        return NextResponse.json(
          { success: false, error: "Missing required field: driftId" },
          { status: 400 }
        );
      }
      await db.update(driftEvents)
        .set({ status: "acknowledged" })
        .where(eq(driftEvents.id, body.driftId));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[API/drift] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process drift request" },
      { status: 500 }
    );
  }
}
