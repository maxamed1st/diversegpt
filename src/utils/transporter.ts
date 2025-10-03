import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.PURELYMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.PURELYMAIL_USERNAME,
    pass: process.env.PURELYMAIL_PASSWORD,
  },
});