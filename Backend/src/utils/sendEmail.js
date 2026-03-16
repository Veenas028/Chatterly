import nodemailer from "nodemailer";

export default async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Chatterly" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
