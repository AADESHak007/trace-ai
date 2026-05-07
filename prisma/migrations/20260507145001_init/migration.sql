-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "audits" (
    "id" TEXT NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'pending',
    "input_tool" TEXT NOT NULL,
    "input_team_size" INTEGER NOT NULL,
    "input_plan" TEXT NOT NULL,
    "input_billing" DECIMAL(65,30) NOT NULL,
    "input_tasks" TEXT NOT NULL,
    "input_email" TEXT NOT NULL,
    "input_company" TEXT NOT NULL,
    "output_spend" DECIMAL(65,30),
    "output_recommendation" TEXT,
    "output_savings_reason" TEXT,
    "output_monthly_saving" DECIMAL(65,30),
    "output_annual_saving" DECIMAL(65,30),
    "error_message" TEXT,
    "llm_raw_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);
