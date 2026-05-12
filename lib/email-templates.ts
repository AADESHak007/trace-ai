export function getAuditReportEmailHtml(data: {
  company: string;
  tool: string;
  savingsMonthly: number;
  savingsAnnual: number;
  recommendation: string;
  isHighSavings: boolean;
}) {
  const { company, tool, savingsMonthly, savingsAnnual, recommendation, isHighSavings } = data;

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #111111; padding: 40px 20px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Audit Complete</h1>
        <p style="color: #94a3b8; margin-top: 8px;">Analysis for ${company}</p>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #111111; font-size: 20px; margin-bottom: 16px;">We found $${savingsAnnual.toLocaleString()} in annual savings.</h2>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
          Our engine has finished analyzing your <strong>${tool}</strong> stack. 
          The verdict: <span style="color: #6d28d9; font-weight: bold;">${recommendation}</span>
        </p>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">Monthly Recovery</span>
            <span style="color: #111111; font-weight: bold;">$${savingsMonthly.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">Annual Recovery</span>
            <span style="color: #10b981; font-weight: bold; font-size: 18px;">$${savingsAnnual.toLocaleString()}</span>
          </div>
        </div>

        ${isHighSavings ? `
          <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
            <h3 style="color: #5b21b6; font-size: 16px; margin: 0 0 8px 0;">🚀 High-Savings Case Detected</h3>
            <p style="color: #6d28d9; margin: 0; font-size: 14px; line-height: 1.5;">
              Our team at Credex has flagged your audit for manual review. We believe we can help you recover these funds faster through direct negotiation. Expect a reach-out from us shortly.
            </p>
          </div>
        ` : ''}

        <a href="${process.env.NEXT_PUBLIC_API_URL}/audit/results" style="display: block; background-color: #6d28d9; color: #ffffff; text-decoration: none; text-align: center; padding: 16px; border-radius: 12px; font-weight: bold; font-size: 16px;">
          View Full Detailed Report
        </a>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
        &copy; 2026 Trace AI by Credex. All rights reserved.
      </div>
    </div>
  `;
}
