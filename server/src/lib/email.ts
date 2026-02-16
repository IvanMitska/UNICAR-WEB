import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'UNICAR <noreply@unicar.com>';

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  firstName: string
) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your UNICAR password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <h1 style="font-size: 24px; font-weight: 600; color: #111; margin: 0 0 8px; letter-spacing: 0.1em;">UNICAR</h1>
            <p style="color: #666; font-size: 14px; margin: 0 0 32px;">Premium Car Rental</p>

            <h2 style="font-size: 20px; font-weight: 400; color: #111; margin: 0 0 16px;">Hi ${firstName},</h2>
            <p style="color: #444; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>

            <a href="${resetUrl}" style="display: inline-block; background: #111; color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 14px; font-weight: 500;">
              Reset Password
            </a>

            <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 32px 0 0;">
              This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to UNICAR!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <h1 style="font-size: 24px; font-weight: 600; color: #111; margin: 0 0 8px; letter-spacing: 0.1em;">UNICAR</h1>
            <p style="color: #666; font-size: 14px; margin: 0 0 32px;">Premium Car Rental</p>

            <h2 style="font-size: 20px; font-weight: 400; color: #111; margin: 0 0 16px;">Welcome, ${firstName}!</h2>
            <p style="color: #444; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Thank you for joining UNICAR. You now have access to our exclusive collection of premium vehicles in Phuket.
            </p>

            <a href="${process.env.FRONTEND_URL}/cars" style="display: inline-block; background: #111; color: white; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 14px; font-weight: 500;">
              Browse Vehicles
            </a>

            <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 32px 0 0;">
              Questions? Contact us at +66 95-965-7805 or reply to this email.
            </p>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
