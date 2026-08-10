import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  company: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form fields." }, { status: 400 });
  }

  // Bot filled honeypot
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const to = process.env.CONTACT_FORM_TO || "info@madam-sl.org";
  const { name, email, phone, subject, message } = parsed.data;

  // Prefer Resend when configured; otherwise accept and log for development.
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MADAM Website <onboarding@resend.dev>",
          to: [to],
          reply_to: email,
          subject: subject || `Contact form: ${name}`,
          text: `From: ${name} <${email}>${phone ? `\nPhone: ${phone}` : ""}\n\n${message}`,
        }),
      });
      if (!res.ok) {
        return NextResponse.json({ ok: false, error: "Email delivery failed." }, { status: 502 });
      }
    } catch {
      return NextResponse.json({ ok: false, error: "Email delivery failed." }, { status: 502 });
    }
  } else {
    console.info("[contact-form]", { name, email, phone, subject, message, to });
  }

  return NextResponse.json({ ok: true });
}
