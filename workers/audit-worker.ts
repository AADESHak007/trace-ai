import "dotenv/config";
import http from "http";
import { Worker, Job } from "bullmq";

// Dummy server to satisfy Render's health check for Free Web Services
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("Audit Worker is active");
}).listen(process.env.PORT || 3000);

import { prisma } from "../lib/prisma";
import { connection, emailQueue } from "../lib/queue";
import { runMathEngine } from "../lib/engine/math-engine";
import { runLLMEngine } from "../lib/engine/llm-engine";
import { TOOL_PRICING } from "../lib/data/pricing";
import { getAuditReportEmailHtml } from "../lib/email-templates";
import { Prisma } from "@prisma/client";

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
        tool: TOOL_PRICING[audit.input_tool]?.name || audit.input_tool,
        toolKey: audit.input_tool,
        plan: audit.input_plan,
        teamSize: audit.input_team_size,
        tasks: audit.input_tasks,
        mathResults: mathResult
      });

      // 4. Update the DB with the results
      const totalMonthlySaving = mathResult.totalSavingsMonthly + llmResult.additionalMonthlySavings;
      const isHighSavings = totalMonthlySaving > 500;

      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: "completed",
          output_spend: audit.input_billing,
          output_monthly_saving: totalMonthlySaving,
          output_annual_saving: totalMonthlySaving * 12,
          output_recommendation: llmResult.recommendation,
          output_savings_reason: llmResult.savingsReason,
          // We use InputJsonValue to satisfy Prisma's strict JSON typing
          llm_raw_response: llmResult as unknown as Prisma.InputJsonValue, 
          completed_at: new Date(),
          // Lead intelligence
          is_high_savings: isHighSavings,
          lead_status: isHighSavings ? "high_savings_flagged" : "captured",
        },
      });

      console.log(`Audit ${auditId} completed successfully!`);

      // 5. Trigger Email Notification
      await emailQueue.add("send-audit-report", {
        to: audit.input_email,
        subject: `Your ${audit.input_company} AI Audit is Ready`,
        html: getAuditReportEmailHtml({
          company: audit.input_company,
          tool: TOOL_PRICING[audit.input_tool]?.name || audit.input_tool,
          savingsMonthly: totalMonthlySaving,
          savingsAnnual: totalMonthlySaving * 12,
          recommendation: llmResult.recommendation,
          isHighSavings: isHighSavings
        })
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown worker error";
      console.error(`Error processing audit ${auditId}:`, error);

      // Update DB to failed so polling stops
      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: "failed",
          error_message: errorMessage,
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
