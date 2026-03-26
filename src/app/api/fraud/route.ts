import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, fraudRules, fraudAlerts } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const recentTransactions = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(50);
    const rules = await db.select().from(fraudRules).limit(100);
    const alerts = await db.select().from(fraudAlerts).orderBy(desc(fraudAlerts.createdAt)).limit(50);
    const stats = await db.select({
      totalTransactions: sql<number>`count(*)`,
      fraudDetected: sql<number>`sum(case when is_fraud = 1 then 1 else 0 end)`,
      avgRiskScore: sql<number>`avg(risk_score)`,
    }).from(transactions);
    return NextResponse.json({ success: true, data: { transactions: recentTransactions, rules, alerts, stats: stats[0] } });
  } catch (error) {
    console.error("[API/fraud] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch fraud data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === "rule") {
      if (!body.name || typeof body.name !== "string") {
        return NextResponse.json(
          { success: false, error: "Missing required field: name" },
          { status: 400 }
        );
      }

      const result = await db.insert(fraudRules).values({
        name: body.name,
        description: body.description || null,
        condition: typeof body.condition === "string" ? body.condition : JSON.stringify(body.condition || {}),
        severity: body.severity || "medium",
      }).returning();
      return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
    }

    if (body.type === "simulation") {
      const fraudIncrease = typeof body.parameters?.fraud_increase === "number"
        ? body.parameters.fraud_increase
        : 0.2;

      return NextResponse.json({
        success: true,
        data: {
          input: body.parameters || {},
          results: {
            projectedFraudIncrease: fraudIncrease,
            estimatedLoss: Math.round(fraudIncrease * 250000),
            detectionRateChange: -Math.round(fraudIncrease * 50),
          },
        },
      });
    }

    return NextResponse.json({ success: false, error: "Unknown type" }, { status: 400 });
  } catch (error) {
    console.error("[API/fraud] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process fraud request" },
      { status: 500 }
    );
  }
}
