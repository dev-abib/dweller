export function newsletterBroadcastTemplate(options: {
  subject: string;
  content: string;
  preheader?: string;
  recipientEmail: string;
  senderName?: string;
  coverImageUrl?: string;
  fontFamily?: string;
  theme?: string;
}): string {
  const siteName = process.env.SITE_NAME || 'Dwellr Insights';
  const siteDescription =
    process.env.SITE_DESCRIPTION ||
    'Weekly perspectives on data-driven strategy, tech innovation, and market intelligence.';
  const publicWebsiteUrl =
    process.env.PUBLIC_WEBSITE_URL ||
    process.env.PUBLIC_URL ||
    process.env.WEBSITE_URL ||
    'https://dwellr.tech';
  const apiUrl =
    process.env.API_URL || `${publicWebsiteUrl}/api/v1`;
  const unsubscribeUrl = `${apiUrl}/newsletter/unsubscribe?email=${encodeURIComponent(options.recipientEmail)}`;

  const fontKey = (options.fontFamily || 'inter').toLowerCase();
  let fontImportUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  let fontStack = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  if (fontKey === 'playfair' || fontKey.includes('serif')) {
    fontImportUrl = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&display=swap';
    fontStack = "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif";
  } else if (fontKey === 'poppins') {
    fontImportUrl = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
    fontStack = "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif";
  } else if (fontKey === 'merriweather') {
    fontImportUrl = 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap';
    fontStack = "'Merriweather', Georgia, serif";
  } else if (fontKey === 'roboto') {
    fontImportUrl = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
    fontStack = "'Roboto', 'Helvetica Neue', Arial, sans-serif";
  } else if (fontKey === 'lato') {
    fontImportUrl = 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap';
    fontStack = "'Lato', sans-serif";
  } else if (fontKey === 'montserrat') {
    fontImportUrl = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap';
    fontStack = "'Montserrat', sans-serif";
  } else if (fontKey === 'mono') {
    fontImportUrl = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap';
    fontStack = "'JetBrains Mono', 'SF Mono', Monaco, 'Courier New', monospace";
  }

  // Helper to format HTML / Rich content into clean, minimal publication typography
  const formatEmailHtml = (raw: string): string => {
    let html = raw.trim();

    if (!/<[a-z][\s\S]*>/i.test(html)) {
      const paragraphs = html.split(/\n\n+/);
      html = paragraphs
        .map((p) => {
          const lines = p.trim().split('\n');
          const isBullet = lines.some((l) => /^[•\-\*]\s|^\d+\.\s/.test(l.trim()));
          if (isBullet) {
            return `<ul>${lines.map((l) => `<li>${l.replace(/^[•\-\*]\s|^\d+\.\s/, '')}</li>`).join('')}</ul>`;
          }
          return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('');
    }

    // Enhance typography for minimalist editorial feel
    html = html
      // Headings
      .replace(/<h1([^>]*)>(.*?)<\/h1>/gi, '<h1$1 style="margin: 32px 0 12px 0; font-size: 24px; font-weight: 800; color: #111827; line-height: 1.3; letter-spacing: -0.4px;">$2</h1>')
      .replace(/<h2([^>]*)>(.*?)<\/h2>/gi, '<h2$1 style="margin: 28px 0 10px 0; font-size: 20px; font-weight: 700; color: #111827; line-height: 1.35; letter-spacing: -0.3px;">$2</h2>')
      .replace(/<h3([^>]*)>(.*?)<\/h3>/gi, '<h3$1 style="margin: 22px 0 8px 0; font-size: 16.5px; font-weight: 700; color: #1f2937; line-height: 1.4;">$2</h3>')
      
      // Paragraphs
      .replace(/<p([^>]*)>(.*?)<\/p>/gi, '<p$1 style="margin: 0 0 18px 0; line-height: 1.75; font-size: 15.5px; color: #374151; letter-spacing: -0.1px;">$2</p>')
      
      // Lists
      .replace(/<ul([^>]*)>/gi, '<ul$1 style="margin: 16px 0 20px 0; padding-left: 22px; color: #374151; font-size: 15px; line-height: 1.75;">')
      .replace(/<ol([^>]*)>/gi, '<ol$1 style="margin: 16px 0 20px 0; padding-left: 22px; color: #374151; font-size: 15px; line-height: 1.75;">')
      .replace(/<li([^>]*)>(.*?)<\/li>/gi, '<li$1 style="margin-bottom: 8px; color: #374151;">$2</li>')
      
      // Minimalist Action / Callout Box
      .replace(/<blockquote([^>]*)>(.*?)<\/blockquote>/gi, `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0; background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px;">
          <tr>
            <td style="padding: 18px 20px; font-size: 14.5px; line-height: 1.6; color: #1f2937;">
              $2
            </td>
          </tr>
        </table>
      `)
      
      // Images
      .replace(/<img([^>]*src=["']([^"']+)["'][^>]*)>/gi, `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 22px 0;">
          <tr>
            <td align="center">
              <img src="$2" style="max-width: 100%; height: auto; border-radius: 10px; display: block; margin: 0 auto;" />
            </td>
          </tr>
        </table>
      `)

      // Markdown image compatibility
      .replace(/!\[(.*?)\]\((https?:\/\/[^\)]+)\)/gi, `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 22px 0;">
          <tr>
            <td align="center">
              <img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 10px; display: block; margin: 0 auto;" />
              <div style="font-size: 12px; color: #6b7280; margin-top: 6px; font-style: italic;">$1</div>
            </td>
          </tr>
        </table>
      `)

      // CTA Buttons (Pill style like LinkedIn / Substack)
      .replace(/\[(.*?)\]\((https?:\/\/[^\)]+)\)/gi, `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 22px 0;">
          <tr>
            <td>
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 9999px; background-color: #0a66c2;">
                    <a href="$2" target="_blank" style="font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 9999px; display: inline-block;">
                      $1
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `)
      
      // Plain Text Links (Preserves custom styled CTA buttons)
      .replace(/<a\b(?![^>]*\bstyle\b)[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '<a href="$1" target="_blank" style="color: #0a66c2; font-weight: 600; text-decoration: underline;">$2</a>')
      
      // Bold
      .replace(/<strong([^>]*)>/gi, '<strong$1 style="color: #111827; font-weight: 700;">')
      .replace(/<b>/gi, '<b style="color: #111827; font-weight: 700;">')
      
      // Divider
      .replace(/<hr([^>]*)>/gi, '<hr$1 style="border: none; border-top: 1px solid #f3f4f6; margin: 28px 0;" />');

    return html;
  };

  const bodyContent = formatEmailHtml(options.content);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.subject}</title>
  <style>
    @import url('${fontImportUrl}');
    body, table, td, a, p { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: ${fontStack} !important; }
    @media screen and (max-width: 640px) {
      .email-wrap { padding: 16px 12px !important; }
      .h1-headline { font-size: 22px !important; line-height: 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; color: #111827;">
  <!-- Hidden Preheader with Anti-Leak Padding -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #ffffff; opacity: 0;">
    ${options.preheader || options.subject}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Main Clean Canvas -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
    <tr>
      <td align="center">
        <table class="email-wrap" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 28px 16px 40px;">
          
          <!-- Publication Header Bar (Logo + Title + Subtitle) -->
          <tr>
            <td style="padding-bottom: 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="46" style="vertical-align: top;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background-color: #0f172a; text-align: center; line-height: 40px; color: #ffffff; font-weight: 800; font-size: 18px;">
                      D
                    </div>
                  </td>
                  <td style="vertical-align: top; padding-left: 12px;">
                    <div style="font-size: 15px; font-weight: 700; color: #111827; line-height: 1.2;">${siteName}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 3px; line-height: 1.4;">${siteDescription}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Optional Hero Cover Image -->
          ${
            options.coverImageUrl
              ? `
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 12px; overflow: hidden; background-color: #f8fafc; border: 1px solid #f1f5f9;">
                    <img src="${options.coverImageUrl}" alt="Cover Image" style="width: 100%; max-width: 600px; height: auto; max-height: 340px; object-fit: cover; aspect-ratio: 16/9; display: block; border-radius: 12px;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ''
          }

          <!-- Article Headline -->
          <tr>
            <td style="padding-bottom: 16px;">
              <h1 class="h1-headline" style="margin: 0; font-size: 26px; font-weight: 800; line-height: 34px; color: #111827; letter-spacing: -0.5px;">
                ${options.subject}
              </h1>
            </td>
          </tr>

          <!-- Author Byline -->
          <tr>
            <td style="padding-bottom: 20px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="28" style="vertical-align: middle;">
                    <div style="width: 24px; height: 24px; border-radius: 50%; background-color: #e2e8f0; text-align: center; line-height: 24px; font-size: 11px; font-weight: 700; color: #334155;">
                      ✍️
                    </div>
                  </td>
                  <td style="padding-left: 8px; vertical-align: middle; font-size: 13.5px; font-weight: 600; color: #4b5563;">
                    ${options.senderName || 'Dwellr Editorial'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Article Body -->
          <tr>
            <td style="padding-top: 4px; padding-bottom: 32px; font-size: 15.5px; line-height: 1.75; color: #374151;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Minimal Footer -->
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #f3f4f6; text-align: left;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                You are receiving this because you subscribed to <strong>${siteName}</strong>.
              </p>
              <div style="font-size: 12px; color: #9ca3af;">
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: underline;">
                  Unsubscribe
                </a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
