-- AlterTable
ALTER TABLE "audits" ADD COLUMN     "input_actual_billing" DECIMAL(65,30),
ADD COLUMN     "input_plan_pricing" DECIMAL(65,30);
