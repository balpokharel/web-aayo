import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";
import type { ContactDto } from "./public.dto";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendContactNotification(contact: ContactDto): Promise<boolean> {
    const host = this.config.get<string>("SMTP_HOST")?.trim();
    const username = this.config.get<string>("SMTP_USER")?.trim();
    const password = this.config.get<string>("SMTP_PASSWORD");
    const recipient = this.config.get<string>("CONTACT_NOTIFICATION_EMAIL")?.trim();
    const port = Number(this.config.get<string | number>("SMTP_PORT") ?? 587);

    if (!host || !username || !password || !recipient || !Number.isInteger(port) || port < 1 || port > 65535) {
      this.logger.warn("Contact was saved, but its email notification was skipped because SMTP is not configured.");
      return false;
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user: username, pass: password },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      });

      const subject = contact.subject.replace(/[\r\n]+/g, " ").trim().slice(0, 200);
      await transporter.sendMail({
        from: this.config.get<string>("SMTP_FROM")?.trim() || username,
        to: recipient,
        replyTo: { name: contact.name, address: contact.email },
        subject: `New Web Aayo contact: ${subject}`,
        text: [
          "A new message was submitted through the Web Aayo contact form.",
          "",
          `Name: ${contact.name}`,
          `Email: ${contact.email}`,
          `Phone: ${contact.phone?.trim() || "Not provided"}`,
          `Subject: ${contact.subject}`,
          `Page: ${contact.landingPage || "/contact"}`,
          "",
          "Message:",
          contact.message,
        ].join("\n"),
      });

      this.logger.log("Contact notification email sent.");
      return true;
    } catch (error) {
      this.logger.error("Contact notification email failed.", error instanceof Error ? error.message : "Unknown SMTP error");
      return false;
    }
  }
}
