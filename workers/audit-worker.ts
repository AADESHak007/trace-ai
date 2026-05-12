import "dotenv/config";
import { Worker, Job } from "bullmq";
import { prisma } from "../lib/prisma";
import { connection } from "../lib/queue";
import { runMathEngine } from "../lib/engine/math-engine";
import { runLLMEngine } from "../lib/engine/llm-engine";

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
        actualBilling: audit.input_actual_billing ? Number(audit.input_actual_billing) : undefined,
        planPricing: audit.input_plan_pricing ? Number(audit.input_plan_pricing) : undefined,
        usagePattern: "medium", // We can refine this later
      });

      // 3.1 Run the LLM Strategy Engine
      const llmResult = await runLLMEngine({
        tool: audit.input_tool,
        plan: audit.input_plan,
        teamSize: audit.input_team_size,
        tasks: audit.input_tasks,
        mathResults: mathResult
      });

      // 4. Update the DB with the results
      // We map the math findings to your DB schema
      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: "completed",
          output_spend: audit.input_billing,
          output_monthly_saving: mathResult.totalSavingsMonthly + llmResult.additionalMonthlySavings,
          output_annual_saving: (mathResult.totalSavingsMonthly + llmResult.additionalMonthlySavings) * 12,
          output_recommendation: llmResult.recommendation,
          output_savings_reason: llmResult.savingsReason,
          llm_raw_response: llmResult as any,
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
