import { transporter } from '@/utils/transporter';

export async function sendPasswordResetEmail({ to, url }: { to: string; url: string; }) {
  const mailOptions = {
    from: '"Diversegpt" <no-reply@walaalka.site>',
    to,
    subject: 'Reset your password',
    html: `
      <p>Hello,</p>
      <p>Click the link <a href="${url}">here</a> to reset your password.</p>
      <p> If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>Presense</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendVerificationEmail({ to, url }: { to: string; url: string; }) {
  const mailOptions = {
    from: '"Diversegpt" <no-reply@walaalka.site>',
    to,
    subject: 'Verify your email',
    html: `
      <p>Hello,</p>
      <p>Welcome to Presense. We are delighted by your presence!</p>
      <p>Please click <a href="${url}">here</a> to verify your email</p>
      <p> If you did not request this, You can safely ignore this email.</p>
      <p>Best regards<br>Presense</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}