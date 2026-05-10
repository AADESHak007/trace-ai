import { Worker, Job } from "bullmq";
import { prisma } from "../lib/prisma";
import { connection } from "../lib/queue";
import { runMathEngine } from "../lib/engine/math-engine";

console.log("Audit Worker started and waiting for jobs...");

const worker = new Worker(
  "audit-queue",
  async (job: Job) => {
    const { auditId } = job.data;
    console.log(`Processing Audit: ${auditId}`);

    try {
      // 1. Update status to 'processing'
      await prisma.audit.update({
        where: { id: auditId },
        data: { status: "processing" },
      });

      // 2. Fetch the audit data
      const audit = await prisma.audit.findUnique({
        where: { id: auditId },
      });

      if (!audit) throw new Error("Audit not found in database");

      // 3. Run the Math Engine logic
      // Note: input_billing is Decimal in Prisma, so we convert to Number
      const mathResult = runMathEngine({
        toolKey: audit.input_tool,
        planKey: audit.input_plan,
        teamSize: audit.input_team_size,
        declaredBilling: Number(audit.input_billing),
        usagePattern: "medium", // We can refine this later
      });

      // 4. Update the DB with the results
      // We map the math findings to your DB schema
      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: "completed",
          output_spend: audit.input_billing,
          output_monthly_saving: mathResult.totalSavingsMonthly,
          output_annual_saving: mathResult.totalSavingsMonthly * 12,
          output_recommendation: mathResult.heroVerdict,
          // We can join all case messages for the reason
          output_savings_reason: Object.values(mathResult.cases)
            .filter(c => c.active)
            .map(c => c.message)
            .join(" | "),
          completed_at: new Date(),
        },
      });

      console.log(`Audit ${auditId} completed successfully!`);
    } catch (error: any) {
      console.error(`Error processing audit ${auditId}:`, error);

      // Update DB to failed so polling stops
      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: "failed",
          error_message: error.message || "Unknown worker error",
        },
      });
    }
  },
  { connection }
);

// Optional: Handle worker events
worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});
