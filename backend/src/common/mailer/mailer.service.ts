import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter;
  private readonly from;

  constructor(private readonly configService: ConfigService) {
    this.from = this.configService.getOrThrow<string>("SMTP_FROM");
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>("SMTP_HOST"),
      port: Number(this.configService.getOrThrow<string>("SMTP_PORT")),
      secure:
        Number(this.configService.getOrThrow<string>("SMTP_PORT")) === 465,
      auth: {
        user: this.configService.getOrThrow<string>("SMTP_USER"),
        pass: this.configService.getOrThrow<string>("SMTP_PASS"),
      },
    });
  }

  async sendPasswordReset(email: string, token: string) {
    await this.sendMailSafely("password reset", {
      from: this.from,
      to: email,
      subject: "Reset your Way Education password",
      text: `Use this password reset token: ${token}`,
      html: `<p>Use this password reset token:</p><p><strong>${token}</strong></p>`,
    });
  }

  async sendEmailVerification(email: string, token: string) {
    await this.sendMailSafely("email verification", {
      from: this.from,
      to: email,
      subject: "Verify your Way Education email",
      text: `Use this verification token: ${token}`,
      html: `<p>Use this verification token:</p><p><strong>${token}</strong></p>`,
    });
  }

  private async sendMailSafely(context: string, mail: Record<string, unknown>) {
    try {
      await this.transporter.sendMail(mail);
    } catch (error) {
      this.logger.error(`Unable to send ${context} email`, error instanceof Error ? error.stack : undefined);
    }
  }

  private escapeHtml(value: unknown) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async sendNewApplicationAlert(toEmail: string, lead: any) {
    const htmlDetails = [
      ["Name", lead.name],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["WhatsApp", lead.whatsapp || "N/A"],
      ["Country of Residence", lead.country?.nameEn || lead.country || "N/A"],
      ["Preferred Country", lead.preferredCountry?.nameEn || lead.preferredCountry || "N/A"],
      ["Preferred University", lead.preferredUniversity?.name || lead.preferredUniversity || "N/A"],
      ["Program/Major", lead.program || "N/A"],
      ["Degree Level", lead.degree || "N/A"],
      ["Language of Instruction", lead.language || "N/A"],
      ["Message", lead.message || "None"],
    ]
      .map(([label, value]) => `${this.escapeHtml(label)}: ${this.escapeHtml(value)}`)
      .join("<br>");

    await this.sendMailSafely("new application alert", {
      from: this.from,
      to: toEmail,
      subject: `New Application/Lead: ${String(lead.name || "").replace(/[\r\n]/g, " ")}`,
      text: `A new application was submitted by ${lead.name}. Please check the admin dashboard for details.`,
      html: `
        <h2>New Application Received</h2>
        <p>A new application or lead was just submitted through the website. Here are the details:</p>
        <div style="background: #f4f6f8; padding: 16px; border-radius: 8px;">
          ${htmlDetails}
        </div>
        <p><br>Log into the <a href="https://wayeducations.com/admin">Admin Dashboard</a> to manage this lead.</p>
      `,
    });
  }
}
