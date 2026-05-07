// prisma/seed.ts
import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  const sampleAudit = await prisma.audit.create({
    data: {
      status: 'completed',
      input_tool: 'Slack',
      input_team_size: 50,
      input_plan: 'Pro',
      input_billing: 450.00,
      input_tasks: 'Internal communication and file sharing',
      input_email: 'admin@company.com',
      input_company: 'Trace AI Labs',
      output_spend: 450.00,
      output_recommendation: 'Switch to Annual billing to save 20%.',
      output_savings_reason: 'Annual discount is currently active.',
      output_monthly_saving: 90.00,
      output_annual_saving: 1080.00,
      llm_raw_response: {
        model: "gpt-4",
        tokens: 1024,
        analysis_id: "audit_001"
      }
    },
  })

  console.log('✅ Seed successful! Created audit ID:', sampleAudit.id)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
