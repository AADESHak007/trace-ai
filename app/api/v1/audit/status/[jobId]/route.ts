import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const { jobId } = await params;

    // 1. Fetch the record once from the DB ...
    const audit = await prisma.audit.findUnique({
      where: { id: jobId },
    });

    if (!audit) {
      return NextResponse.json({ message: "Audit not found", success: false }, { status: 404 });
    }

    // 2. Return the current state ...
    if (audit.status === "completed") {
      return NextResponse.json({
        message: "Audit completed",
        success: true,
        data: {
          output_spend: audit.output_spend,
          output_recommendation: audit.output_recommendation,
          output_savings_reason: audit.output_savings_reason,
          output_monthly_saving: audit.output_monthly_saving,
          output_annual_saving: audit.output_annual_saving,
          completed_at: audit.completed_at,
        },
      });
    }

    if (audit.status === "failed") {
      return NextResponse.json({
        message: "Audit failed",
        success: false,
        error: audit.error_message,
      });
    }

    // 3. If still pending or processing, tell the client to keep waiting
    return NextResponse.json({
      message: `Audit is currently ${audit.status}`,
      success: true,
      status: audit.status,
    });

  } catch (error) {
    console.error("Polling Error:", error);
    return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
  }
}
