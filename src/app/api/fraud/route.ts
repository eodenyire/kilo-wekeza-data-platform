import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, fraudRules, fraudAlerts } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const recentTransactions = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(50);
    const rules = await db.select().from(fraudRules);
    const alerts = await db.select().from(fraudAlerts).orderBy(desc(fraudAlerts.createdAt));
    const stats = await db.select({
      totalTransactions: sql<number>`count(*)`,
      fraudDetected: sql<number>`sum(case when is_fraud = 1 then 1 else 0 end)`,
      avgRiskScore: sql<number>`avg(risk_score)`,
    }).from(transactions);
    return NextResponse.json({ success: true, data: { transactions: recentTransactions, rules, alerts, stats: stats[0] } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.type === "rule") {
      const result = await db.insert(fraudRules).values(body).returning();
      return NextResponse.json({ success: true, data: result[0] });
    }
    if (body.type === "simulation") {
      return NextResponse.json({
        success: true,
        data: {
          input: body.parameters,
          results: {
            projectedFraudIncrease: body.parameters.fraud_increase || 0.2,
            estimatedLoss: Math.round(Math.random() * 500000),
            detectionRateChange: -Math.round(Math.random() * 10),
          },
        },
      });
    }
    return NextResponse.json({ success: false, error: "Unknown type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
