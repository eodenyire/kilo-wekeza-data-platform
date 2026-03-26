import { NextResponse } from "next/server";
import { db } from "@/db";
import { dataContracts, contractValidations, contractAlerts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const contracts = await db.select().from(dataContracts).limit(200);
    const validations = await db.select().from(contractValidations).orderBy(desc(contractValidations.validatedAt)).limit(100);
    const alerts = await db.select().from(contractAlerts).orderBy(desc(contractAlerts.createdAt)).limit(50);
    return NextResponse.json({ success: true, data: { contracts, validations, alerts } });
  } catch (error) {
    console.error("[API/contracts] GET failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contract data" },
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

    if (!body.datasetName || typeof body.datasetName !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required field: datasetName" },
        { status: 400 }
      );
    }

    const result = await db.insert(dataContracts).values({
      name: body.name,
      datasetName: body.datasetName,
      schema: typeof body.schema === "string" ? body.schema : JSON.stringify(body.schema || {}),
      constraints: body.constraints ? JSON.stringify(body.constraints) : null,
      sla: body.sla ? JSON.stringify(body.sla) : null,
      owner: body.owner || null,
      status: body.status || "draft",
    }).returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error("[API/contracts] POST failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create data contract" },
      { status: 500 }
    );
  }
}
