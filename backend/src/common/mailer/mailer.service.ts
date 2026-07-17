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
      secure: Number(this.configService.getOrThrow<string>("SMTP_PORT")) === 465,
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
}
