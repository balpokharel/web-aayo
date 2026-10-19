declare module "nodemailer" {
  interface SMTPTransportOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
    connectionTimeout: number;
    greetingTimeout: number;
    socketTimeout: number;
  }

  interface ContactMailOptions {
    from: string;
    to: string;
    replyTo: { name: string; address: string };
    subject: string;
    text: string;
  }

  interface MailTransporter {
    sendMail(options: ContactMailOptions): Promise<unknown>;
  }

  const nodemailer: {
    createTransport(options: SMTPTransportOptions): MailTransporter;
  };

  export default nodemailer;
}
