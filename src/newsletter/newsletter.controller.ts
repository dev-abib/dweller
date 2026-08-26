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
  @HttpCode(200)
  @ApiOperation({ summary: 'Public: Unsubscribe via one-click link' })
  unsubscribeGet(@Query('email') email: string) {
    return this.newsletterService.unsubscribe({ email });
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
