import { chatbotConfig } from "../config";
import type { LeadRecord } from "../database";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function detailRows(lead: LeadRecord) {
  return chatbotConfig.questions.map((question) => {
    const value = escapeHtml(lead.answers[question.id] || "Not provided");
    return `<tr>
      <td style="padding:13px 0;border-bottom:1px solid #f2e3e7;color:#8a6870;font-size:13px;width:34%;vertical-align:top;">${escapeHtml(question.label)}</td>
      <td style="padding:13px 0;border-bottom:1px solid #f2e3e7;color:#221c1e;font-size:14px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>`;
  }).join("");
}

function emailShell({ preheader, eyebrow, title, intro, body, footer }: { preheader: string; eyebrow: string; title: string; intro: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f8f2f4;font-family:Arial,Helvetica,sans-serif;color:#221c1e;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f2f4;">
    <tr><td align="center" style="padding:34px 14px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #f0dfe4;border-radius:22px;overflow:hidden;box-shadow:0 18px 50px rgba(73,35,46,.10);">
        <tr><td style="padding:26px 32px;background:#fff8fa;border-bottom:1px solid #f3e3e7;">
          <table role="presentation" width="100%"><tr>
            <td><div style="display:inline-block;width:38px;height:38px;line-height:38px;text-align:center;border-radius:12px;background:#e85d75;color:#fff;font-size:18px;font-weight:800;">S</div></td>
            <td align="right" style="font-size:18px;font-weight:800;letter-spacing:-.3px;color:#281f22;">Salon<span style="color:#e85d75;">Vault</span></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:42px 32px 24px;background:#e85d75;color:#fff;">
          <div style="margin-bottom:12px;font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:#ffe5eb;">${escapeHtml(eyebrow)}</div>
          <h1 style="margin:0 0 14px;font-size:31px;line-height:1.16;letter-spacing:-.8px;color:#fff;">${escapeHtml(title)}</h1>
          <p style="margin:0;font-size:16px;line-height:1.65;color:#fff7f9;">${escapeHtml(intro)}</p>
        </td></tr>
        <tr><td style="padding:30px 32px 34px;">${body}</td></tr>
        <tr><td style="padding:22px 32px;background:#fff8fa;border-top:1px solid #f3e3e7;text-align:center;color:#92757c;font-size:12px;line-height:1.6;">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function buildClientEmail(lead: LeadRecord) {
  const name = lead.answers.name || "there";
  const service = lead.answers.service || "your project";
  const html = emailShell({
    preheader: "Your SalonVault inquiry is safely with our team.",
    eyebrow: "Inquiry received",
    title: `You're in good hands, ${name}.`,
    intro: `We've received your inquiry about ${service}. A member of our team will review it and reach out with the clearest next step.`,
    body: `<div style="margin-bottom:22px;padding:18px 20px;border-radius:14px;background:#fff7f9;border:1px solid #f4dce2;">
      <div style="margin-bottom:5px;color:#9b6673;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">What happens next</div>
      <div style="color:#33272a;font-size:15px;line-height:1.6;">We'll look over your goals, then contact you to discuss the best-fit direction for your business.</div>
    </div>
    <h2 style="margin:0 0 8px;font-size:17px;color:#2b2224;">Your details</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${detailRows(lead)}</table>
    <div style="padding-top:26px;text-align:center;"><a href="https://salonvault.online" style="display:inline-block;padding:13px 24px;border-radius:999px;background:#221c1e;color:#fff;text-decoration:none;font-size:13px;font-weight:700;">Visit SalonVault</a></div>`,
    footer: "SalonVault &middot; Digital growth systems for modern beauty businesses<br>If you didn't submit this inquiry, you can ignore this email.",
  });
  const text = `Hi ${name},\n\nWe've received your SalonVault inquiry about ${service}. Our team will review it and reach out with the clearest next step.\n\n${chatbotConfig.questions.map((question) => `${question.label}: ${lead.answers[question.id] || "Not provided"}`).join("\n")}\n\nSalonVault`;
  return { html, text };
}

export function buildTeamEmail(lead: LeadRecord) {
  const name = lead.answers.name || "New visitor";
  const email = lead.answers.email || "";
  const capturedAt = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(lead.createdAt));
  const html = emailShell({
    preheader: `${name} submitted a new SalonVault inquiry.`,
    eyebrow: lead.qualification === "qualified" ? "New qualified lead" : "New lead - review recommended",
    title: `${name} is ready to talk.`,
    intro: `A new inquiry has been captured for ${lead.answers.service || "a SalonVault service"}. Everything you need for the first follow-up is below.`,
    body: `<div style="margin-bottom:20px;padding:15px 18px;border-radius:13px;background:#f2fbf7;border:1px solid #d7efe3;color:#276548;font-size:13px;font-weight:700;">Captured ${escapeHtml(capturedAt)} UTC &middot; ${escapeHtml(lead.qualification.replace("_", " "))}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${detailRows(lead)}</table>
    <div style="padding-top:26px;text-align:center;"><a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:14px 26px;border-radius:999px;background:#e85d75;color:#fff;text-decoration:none;font-size:13px;font-weight:800;">Reply to ${escapeHtml(name)}</a></div>
    <p style="margin:22px 0 0;text-align:center;color:#a0838a;font-size:11px;">Lead ID: ${escapeHtml(lead.id)}</p>`,
    footer: "This notification was generated by the SalonVault website assistant.",
  });
  const text = `New SalonVault lead\n\n${chatbotConfig.questions.map((question) => `${question.label}: ${lead.answers[question.id] || "Not provided"}`).join("\n")}\n\nQualification: ${lead.qualification}\nLead ID: ${lead.id}`;
  return { html, text };
}
