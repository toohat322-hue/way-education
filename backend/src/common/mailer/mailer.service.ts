import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class MailerService {
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
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: "Reset your Way Education password",
      text: `Use this password reset token: ${token}`,
      html: `<p>Use this password reset token:</p><p><strong>${token}</strong></p>`,
    });
  }

  async sendEmailVerification(email: string, token: string) {
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: "Verify your Way Education email",
      text: `Use this verification token: ${token}`,
      html: `<p>Use this verification token:</p><p><strong>${token}</strong></p>`,
    });
  }

  async sendNewApplicationAlert(toEmail: string, lead: any) {
    const details = [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone}`,
      `WhatsApp: ${lead.whatsapp || "N/A"}`,
      `Country of Residence: ${lead.country?.nameEn || lead.country || "N/A"}`,
      `Preferred Country: ${lead.preferredCountry?.nameEn || lead.preferredCountry || "N/A"}`,
      `Preferred University: ${lead.preferredUniversity?.name || lead.preferredUniversity || "N/A"}`,
      `Program/Major: ${lead.program || "N/A"}`,
      `Degree Level: ${lead.degree || "N/A"}`,
      `Language of Instruction: ${lead.language || "N/A"}`,
      `Message: ${lead.message || "None"}`,
    ].join("<br>");

    await this.transporter
      .sendMail({
        from: this.from,
        to: toEmail,
        subject: `New Application/Lead: ${lead.name}`,
        text: `A new application was submitted by ${lead.name}. Please check the admin dashboard for details.`,
        html: `
        <h2>New Application Received</h2>
        <p>A new application or lead was just submitted through the website. Here are the details:</p>
        <div style="background: #f4f6f8; padding: 16px; border-radius: 8px;">
          ${details}
        </div>
        <p><br>Log into the <a href="https://wayeducations.com/admin">Admin Dashboard</a> to manage this lead.</p>
      `,
      })
      .catch((err) => {
        console.error(
          "Failed to send email alert. Check SMTP configuration.",
          err,
        );
      });
  }
}
