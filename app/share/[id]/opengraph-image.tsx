import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { TOOL_PRICING } from "@/lib/data/pricing";

export const runtime = "nodejs";

export const alt = "Trace AI Audit Report";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
    select: {
      input_tool: true,
      output_annual_saving: true,
    },
  });

  if (!audit) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "#050505",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Trace AI | Audit Not Found
        </div>
      ),
      { ...size }
    );
  }

  const toolName = TOOL_PRICING[audit.input_tool]?.name || audit.input_tool;
  const savings = Number(audit.output_annual_saving || 0).toLocaleString();

  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "80px",
        }}
      >
        {/* Background Mesh */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            background: "#6d28d9",
            filter: "blur(100px)",
            opacity: 0.3,
            borderRadius: "100%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            background: "#10b981",
            filter: "blur(100px)",
            opacity: 0.2,
            borderRadius: "100%",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "4px",
              fontSize: "24px",
              fontWeight: "900",
              color: "#6d28d9",
            }}
          >
            Trace AI Audit Report
          </div>
          
          <div
            style={{
              fontSize: "80px",
              fontWeight: "900",
              color: "white",
              textAlign: "center",
              lineHeight: 1.1,
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Found <span style={{ color: "#10b981" }}>${savings}/yr</span></span>
            <span style={{ fontSize: "40px", color: "#94a3b8", marginTop: "10px" }}>
              in {toolName} overpayments.
            </span>
          </div>

          <div
            style={{
              marginTop: "60px",
              background: "white",
              color: "black",
              padding: "20px 40px",
              borderRadius: "20px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Run Your Free Audit &rarr;
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "18px",
            color: "#475569",
            fontWeight: "bold",
          }}
        >
          trace-ai.com | Powered by Credex
        </div>
      </div>
    ),
    { ...size }
  );
}
