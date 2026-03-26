import { NextResponse } from "next/server";
import { db } from "@/db";
import { kpiMetrics, aiRecommendations, scenarios, executiveAlerts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const kpis = await db.select().from(kpiMetrics).orderBy(desc(kpiMetrics.recordedAt));
    const recommendations = await db.select().from(aiRecommendations).orderBy(desc(aiRecommendations.createdAt));
    const allScenarios = await db.select().from(scenarios).orderBy(desc(scenarios.createdAt));
    const alerts = await db.select().from(executiveAlerts).orderBy(desc(executiveAlerts.createdAt));
    return NextResponse.json({ success: true, data: { kpis, recommendations, scenarios: allScenarios, alerts } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "accept_recommendation") {
      await db.update(aiRecommendations)
        .set({ status: "accepted" })
        .where(eq(aiRecommendations.id, body.recommendationId));
      return NextResponse.json({ success: true });
    }
    if (body.action === "reject_recommendation") {
      await db.update(aiRecommendations)
        .set({ status: "rejected" })
        .where(eq(aiRecommendations.id, body.recommendationId));
      return NextResponse.json({ success: true });
    }
    if (body.action === "dismiss_alert") {
      await db.update(executiveAlerts)
        .set({ status: "dismissed" })
        .where(eq(executiveAlerts.id, body.alertId));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
