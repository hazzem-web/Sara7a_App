import nodemailer from 'nodemailer';
import { AppEmail, AppPassword } from '../../../../config/index.js';

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: AppEmail,
    pass: AppPassword,
  },
});

// Send an email using async/await
export const sendEmail = async ({
  to ,
  subject , 
  html
} = {}) => {
  const info = await transporter.sendMail({
    from: `"Sara7a App" <${AppEmail}>`,
    to,
    subject,
    html
  });

  console.log("Message sent:", info.messageId);
}