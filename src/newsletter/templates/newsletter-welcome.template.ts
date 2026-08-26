export function newsletterWelcomeTemplate(email: string, name?: string): string {
  const siteName = process.env.SITE_NAME || 'Dwellr';
  const publicWebsiteUrl =
    process.env.PUBLIC_WEBSITE_URL ||
    process.env.PUBLIC_URL ||
    process.env.WEBSITE_URL ||
    'https://dwellr.tech';
  const apiUrl =
    process.env.API_URL || `${publicWebsiteUrl}/api/v1`;
  const unsubscribeUrl = `${apiUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the ${siteName} Newsletter</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 12px !important; }
      .content-cell { padding: 28px 20px !important; }
      .header-cell { padding: 24px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #0f172a;">
  <span style="display:none;font-size:1px;color:#f1f5f9;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">Welcome to our official newsletter and platform updates.</span>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table class="email-container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Top Accent Gradient Bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #6366f1 100%);"></td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td class="header-cell" style="padding: 32px 36px 24px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <div style="display: inline-block;">
                      <span style="font-size: 24px; font-weight: 900; letter-spacing: -0.7px; color: #0f172a;">
                        ${siteName}
                      </span>
                      <span style="display: inline-block; margin-left: 8px; vertical-align: middle; background-color: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.3px; border: 1px solid #a7f3d0;">
                        WELCOME
                      </span>
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="font-size: 12px; font-weight: 500; color: #94a3b8;">
                      ${currentDate}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Greeting -->
          <tr>
            <td style="padding: 28px 36px 12px; background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
              <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; line-height: 1.35; letter-spacing: -0.4px; color: #0f172a;">
                You're in! 🎉 Welcome to ${siteName}${name ? `, ${name}` : ''}.
              </h1>
              <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500; line-height: 1.5;">
                We're thrilled to have you join our growing community of industry enthusiasts and readers.
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content-cell" style="padding: 32px 36px; line-height: 1.75; font-size: 15px; color: #334155;">
              <p style="margin: 0 0 16px 0;">
                Thank you for subscribing to the <strong>${siteName}</strong> newsletter. Every edition brings you:
              </p>
              
              <!-- Value Bullets Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 20px 0; padding: 16px 20px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #1e293b;">
                    💡 <strong>Exclusive Market Insights</strong> & in-depth analyses.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #1e293b;">
                    🚀 <strong>First Look at New Features</strong> and upcoming tools.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #1e293b;">
                    ✨ <strong>Curated Industry News</strong> tailored for you.
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0;">
                We value your time and only deliver high-signal, relevant updates directly to your inbox.
              </p>

              <!-- Explore CTA Button -->
              <div style="text-align: center; margin: 32px 0 12px 0;">
                <a href="${publicWebsiteUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; letter-spacing: 0.2px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);">
                  Explore ${siteName} Now →
                </a>
              </div>

              <!-- Signature -->
              <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a;">
                  Best regards,
                </p>
                <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">
                  The ${siteName} Editorial Team
                </p>
              </div>
            </td>
          </tr>

          <!-- Modern Clean Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 28px 36px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 500; color: #64748b; line-height: 1.6;">
                You received this email because you subscribed to updates on <strong>${siteName}</strong>.<br/>
                Sent to <span style="color: #0f172a; font-weight: 600;">${email}</span>
              </p>
              <div style="margin: 16px 0 10px 0;">
                <a href="${unsubscribeUrl}" style="display: inline-block; font-size: 11px; font-weight: 600; color: #ef4444; text-decoration: none; background-color: #fef2f2; border: 1px solid #fee2e2; padding: 4px 12px; border-radius: 6px;">
                  Unsubscribe from updates
                </a>
              </div>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">
                © ${new Date().getFullYear()} ${siteName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
