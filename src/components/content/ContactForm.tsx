"use client";

import { useState } from "react";

const fieldClass =
  "w-full border border-black/15 bg-white px-4 py-3.5 text-base text-[var(--madam-ink)] outline-none transition placeholder:text-black/35 focus:border-[var(--madam-green)]";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong");
      }
      setStatus("success");
      setMessage("Thank you. Your message has been sent.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to send message");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl" noValidate>
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Name"
            autoComplete="name"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="E-mail"
            autoComplete="email"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="sr-only">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone"
            autoComplete="tel"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="subject" className="sr-only">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            placeholder="Subject"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="sr-only">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          placeholder="Your message"
          className={`${fieldClass} resize-y min-h-[160px]`}
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[var(--madam-green)] px-10 py-3.5 text-base font-semibold uppercase tracking-wide text-white transition hover:bg-[var(--madam-green-dark)] disabled:opacity-70"
        >
          {status === "loading" ? "Sending…" : "Send"}
        </button>
      </div>

      {message ? (
        <p
          className={`mt-4 text-sm ${status === "success" ? "text-[var(--madam-green)]" : "text-[var(--madam-coral)]"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
