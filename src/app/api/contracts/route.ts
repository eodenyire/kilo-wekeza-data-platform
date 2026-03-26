import { NextResponse } from "next/server";
import { db } from "@/db";
import { dataContracts, contractValidations, contractAlerts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const contracts = await db.select().from(dataContracts);
    const validations = await db.select().from(contractValidations).orderBy(desc(contractValidations.validatedAt));
    const alerts = await db.select().from(contractAlerts).orderBy(desc(contractAlerts.createdAt));
    return NextResponse.json({ success: true, data: { contracts, validations, alerts } });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await db.insert(dataContracts).values(body).returning();
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
