import "dotenv/config";
import { Worker, Job } from "bullmq";
import nodemailer from "nodemailer";
import { connection } from "../lib/queue";

console.log("Email Worker started...");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const worker = new Worker(
  "email-queue",
  async (job: Job) => {
    const { to, subject, body, html } = job.data;
    console.log(`Sending email to: ${to}`);

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Trace AI" <no-reply@traceai.com>',
        to,
        subject,
        text: body,
        html,
      });
      console.log(`Email sent to ${to} successfully.`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error; // Re-throw to trigger BullMQ retry
    }
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.log(`Email Job ${job?.id} failed: ${err.message}`);
});
