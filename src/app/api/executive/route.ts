import { NextResponse } from "next/server";
import { db } from "@/db";
import { kpiMetrics, aiRecommendations, scenarios, executiveAlerts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const kpis = await db.select().from(kpiMetrics).orderBy(desc(kpiMetrics.recordedAt)).limit(100);
    const recommendations = await db.select().from(aiRecommendations).orderBy(desc(aiRecommendations.createdAt)).limit(50);
    const allScenarios = await db.select().from(scenarios).orderBy(desc(scenarios.createdAt)).limit(50);
    const alerts = await db.select().from(executiveAlerts).orderBy(desc(executiveAlerts.createdAt)).limit(50);
    return NextResponse.json({ success: true, data: { kpis, recommendations, scenarios: allScenarios, alerts } });
  } catch (error) {
    console.error("[API/executive] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch executive data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "accept_recommendation") {
      if (!body.recommendationId || typeof body.recommendationId !== "number") {
        return NextResponse.json(
          { success: false, error: "Missing required field: recommendationId" },
          { status: 400 }
        );
      }
      await db.update(aiRecommendations)
        .set({ status: "accepted" })
        .where(eq(aiRecommendations.id, body.recommendationId));
      return NextResponse.json({ success: true });
    }

    if (body.action === "reject_recommendation") {
      if (!body.recommendationId || typeof body.recommendationId !== "number") {
        return NextResponse.json(
          { success: false, error: "Missing required field: recommendationId" },
          { status: 400 }
        );
      }
      await db.update(aiRecommendations)
        .set({ status: "rejected" })
        .where(eq(aiRecommendations.id, body.recommendationId));
      return NextResponse.json({ success: true });
    }

    if (body.action === "dismiss_alert") {
      if (!body.alertId || typeof body.alertId !== "number") {
        return NextResponse.json(
          { success: false, error: "Missing required field: alertId" },
          { status: 400 }
        );
      }
      await db.update(executiveAlerts)
        .set({ status: "dismissed" })
        .where(eq(executiveAlerts.id, body.alertId));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[API/executive] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process executive request" },
      { status: 500 }
    );
  }
}
