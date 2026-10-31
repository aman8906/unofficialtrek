import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

// Without SMTP settings (development) the email is printed in the backend terminal.
export async function sendMail({ to, subject, text, html }) {
  if (!env.smtp.host) {
    console.log(`\n[EMAIL not configured, printing instead]\nTo: ${to}\nSubject: ${subject}\n${text}\n`);
    return { logged: true };
  }
  transporter ||= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  await transporter.sendMail({ from: env.mailFrom, to, subject, text, html });
  return { sent: true };
}