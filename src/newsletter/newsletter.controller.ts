import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto, UnsubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { BroadcastNewsletterDto } from './dto/broadcast-newsletter.dto';
import { NewsletterQueryDto } from './dto/newsletter-query.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt.types';
import { getClientIp } from '../common/helpers/ip.helper';
import { createFileUploadInterceptor } from '../common/interceptors/file-upload.interceptor';
import { FileValidationPipe, type MulterFile } from '../common/pipes/file-validation.pipe';
import { NewsletterStatus } from '@prisma/client';
import type { Request, Response } from 'express';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  // ─── Public Endpoints (Accessible by all website visitors) ────────────────
  @Post('subscribe')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Public: Subscribe to website newsletter' })
  subscribe(
    @Body() dto: SubscribeNewsletterDto,
    @Req() req: Request,
  ) {
    const clientIp = getClientIp(req);
    const userAgent = req.headers['user-agent'] as string | undefined;
    return this.newsletterService.subscribe(dto, clientIp, userAgent);
  }

  @Post('unsubscribe')
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Public: Unsubscribe from website newsletter' })
  unsubscribePost(@Body() dto: UnsubscribeNewsletterDto) {
    return this.newsletterService.unsubscribe(dto);
  }

  @Get('unsubscribe')
  @Public()
  @ApiOperation({ summary: 'Public: Unsubscribe via one-click link' })
  async unsubscribeGet(
    @Query('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const isHtmlRequest =
      req.headers.accept?.includes('text/html') ||
      !req.headers.accept?.includes('application/json');

    if (!email) {
      if (isHtmlRequest) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(400).send(
          this.renderUnsubscribePage({
            success: false,
            message: 'No email address specified in the unsubscribe link.',
          }),
        );
      }
      return res.status(400).json({ message: 'Email query parameter is required.' });
    }

    const result = await this.newsletterService.unsubscribe({ email });

    if (isHtmlRequest) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(
        this.renderUnsubscribePage({
          success: true,
          email,
          message: result.message || 'You have been successfully unsubscribed.',
        }),
      );
    }

    return res.status(200).json(result);
  }

  private renderUnsubscribePage(params: {
    success: boolean;
    email?: string;
    message: string;
  }): string {
    const siteName = process.env.SITE_NAME || 'Dwellr';
    const publicUrl = process.env.PUBLIC_WEBSITE_URL || 'https://dwellr.tech';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe | ${siteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #ffffff;
      max-width: 480px;
      width: 100%;
      padding: 40px 32px;
      border-radius: 20px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
      border: 1px solid #e2e8f0;
      text-align: center;
    }
    .icon {
      width: 56px;
      height: 56px;
      margin: 0 auto 20px;
      border-radius: 16px;
      background: ${params.success ? '#ecfdf5' : '#fef2f2'};
      color: ${params.success ? '#10b981' : '#ef4444'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.4px;
      margin-bottom: 8px;
      color: #0f172a;
    }
    p {
      font-size: 14.5px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .email-badge {
      display: inline-block;
      background: #f1f5f9;
      color: #334155;
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 24px;
      word-break: break-all;
    }
    .btn {
      display: inline-block;
      width: 100%;
      background: #0f172a;
      color: #ffffff;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 13px 24px;
      border-radius: 12px;
      transition: all 0.2s ease;
    }
    .btn:hover {
      background: #1e293b;
    }
    .footer-note {
      margin-top: 24px;
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      ${params.success ? '✓' : '✕'}
    </div>
    <h1>${params.success ? 'Unsubscribed Successfully' : 'Unsubscribe Failed'}</h1>
    <p>${params.message}</p>
    ${params.email ? `<div class="email-badge">${params.email}</div>` : ''}
    <div>
      <a href="${publicUrl}" class="btn">Return to ${siteName}</a>
    </div>
    <div class="footer-note">
      If you did this by mistake, you can re-subscribe anytime on our website.
    </div>
  </div>
</body>
</html>`;
  }

  // ─── Admin Endpoints (Accessible to all staff & administrators) ─────────────
  @Get('subscribers')
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin: Get paginated newsletter subscribers' })
  getSubscribers(@Query() query: NewsletterQueryDto) {
    return this.newsletterService.getSubscribers(query);
  }

  @Get('stats')
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin: Get newsletter metrics & subscriber statistics' })
  getStats() {
    return this.newsletterService.getStats();
  }

  @Get('export-csv')
  @Auth('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Export all subscribers as CSV' })
  async exportCsv(@Res() res: Response) {
    const csvData = await this.newsletterService.exportSubscribersCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=newsletter_subscribers.csv');
    return res.status(200).send(csvData);
  }

  @Post('upload-asset')
  @Auth('admin')
  @ApiBearerAuth()
  @UseInterceptors(createFileUploadInterceptor({ fieldName: 'file' }))
  @ApiOperation({ summary: 'Admin: Upload image asset for newsletter content' })
  @ApiConsumes('multipart/form-data')
  uploadAsset(
    @UploadedFile(new FileValidationPipe({ required: true, maxSizeMB: 10 }))
    file: MulterFile,
  ) {
    return this.newsletterService.uploadAsset(file);
  }

  @Post('broadcast')
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiOperation({ summary: 'Admin: Dispatch email broadcast to all active subscribers' })
  sendBroadcast(
    @Body() dto: BroadcastNewsletterDto,
    @CurrentUser() admin: JwtPayload,
  ) {
    return this.newsletterService.sendBroadcast(dto, admin);
  }

  @Get('broadcasts')
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin: Get newsletter broadcast dispatch history' })
  getBroadcasts() {
    return this.newsletterService.getBroadcasts();
  }

  @Patch('subscribers/:id/status')
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin: Update subscriber status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: NewsletterStatus,
  ) {
    return this.newsletterService.toggleSubscriberStatus(id, status);
  }

  @Delete('subscribers/:id')
  @Auth('admin')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin: Remove subscriber from list' })
  deleteSubscriber(@Param('id') id: string) {
    return this.newsletterService.deleteSubscriber(id);
  }
}
