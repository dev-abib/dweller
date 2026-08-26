import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../infra/mail/mail.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { SubscribeNewsletterDto, UnsubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { BroadcastNewsletterDto } from './dto/broadcast-newsletter.dto';
import { NewsletterQueryDto } from './dto/newsletter-query.dto';
import { NewsletterStatus, Prisma } from '@prisma/client';
import { newsletterWelcomeTemplate } from './templates/newsletter-welcome.template';
import { newsletterBroadcastTemplate } from './templates/newsletter-broadcast.template';
import { JwtPayload } from '../auth/types/jwt.types';
import type { MulterFile } from '../common/pipes/file-validation.pipe';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // ─── Asset Upload (Images for rich emails) ──────────────────────────────────
  async uploadAsset(file?: MulterFile) {
    if (!file) {
      throw new BadRequestException('No image file provided for upload');
    }
    const uploaded = await this.cloudinary.uploadFile(file, 'newsletter-assets');
    return {
      message: 'Asset uploaded successfully',
      data: {
        url: uploaded.url,
        publicId: uploaded.publicId,
      },
    };
  }

  // ─── Public Subscription ──────────────────────────────────────────────────
  async subscribe(dto: SubscribeNewsletterDto, ipAddress?: string, userAgent?: string) {
    const cleanEmail = dto.email.trim().toLowerCase();

    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status === NewsletterStatus.SUBSCRIBED) {
        return {
          message: 'You are already subscribed to our newsletter!',
          data: existing,
        };
      }

      // Re-activate previously unsubscribed user
      const updated = await this.prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          status: NewsletterStatus.SUBSCRIBED,
          name: dto.name || existing.name,
          source: dto.source || existing.source,
          unsubscribedAt: null,
          ipAddress: ipAddress || existing.ipAddress,
          userAgent: userAgent || existing.userAgent,
        },
      });

      // Attempt sending welcome email non-blockingly
      this.sendWelcomeEmailSafe(cleanEmail, updated.name || undefined);

      return {
        message: 'Welcome back! You have successfully resubscribed.',
        data: updated,
      };
    }

    const newSubscriber = await this.prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        name: dto.name?.trim() || null,
        source: dto.source || 'website_footer',
        status: NewsletterStatus.SUBSCRIBED,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    // Attempt sending welcome email non-blockingly
    this.sendWelcomeEmailSafe(cleanEmail, newSubscriber.name || undefined);

    return {
      message: 'Thank you for subscribing to our newsletter!',
      data: newSubscriber,
    };
  }

  // ─── Public Unsubscribe ───────────────────────────────────────────────────
  async unsubscribe(dto: UnsubscribeNewsletterDto) {
    const cleanEmail = dto.email.trim().toLowerCase();

    const subscriber = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (!subscriber) {
      return {
        message: 'You have been unsubscribed from the newsletter.',
      };
    }

    await this.prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: NewsletterStatus.UNSUBSCRIBED,
        unsubscribedAt: new Date(),
      },
    });

    return {
      message: 'You have been successfully unsubscribed.',
    };
  }

  // ─── Admin: List Subscribers ──────────────────────────────────────────────
  async getSubscribers(query: NewsletterQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 15;
    const skip = (page - 1) * limit;

    const where: Prisma.NewsletterSubscriberWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { email: { contains: s, mode: 'insensitive' } },
        { name: { contains: s, mode: 'insensitive' } },
        { source: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [subscribers, total] = await Promise.all([
      this.prisma.newsletterSubscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.newsletterSubscriber.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      message: 'Subscribers retrieved successfully',
      data: {
        subscribers,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    };
  }

  // ─── Admin: Summary Metrics & Stats ───────────────────────────────────────
  async getStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalSubscribers,
      activeSubscribers,
      unsubscribedCount,
      newLast30Days,
      totalBroadcasts,
    ] = await Promise.all([
      this.prisma.newsletterSubscriber.count(),
      this.prisma.newsletterSubscriber.count({
        where: { status: NewsletterStatus.SUBSCRIBED },
      }),
      this.prisma.newsletterSubscriber.count({
        where: { status: NewsletterStatus.UNSUBSCRIBED },
      }),
      this.prisma.newsletterSubscriber.count({
        where: {
          status: NewsletterStatus.SUBSCRIBED,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      this.prisma.newsletterBroadcast.count(),
    ]);

    return {
      message: 'Newsletter stats retrieved successfully',
      data: {
        totalSubscribers,
        activeSubscribers,
        unsubscribedCount,
        newLast30Days,
        totalBroadcasts,
      },
    };
  }

  // ─── Admin: Send Broadcast ────────────────────────────────────────────────
  async sendBroadcast(dto: BroadcastNewsletterDto, admin: JwtPayload) {
    const activeSubscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { status: NewsletterStatus.SUBSCRIBED },
      select: { id: true, email: true },
    });

    if (activeSubscribers.length === 0) {
      throw new BadRequestException('No active subscribers available to broadcast.');
    }

    const broadcast = await this.prisma.newsletterBroadcast.create({
      data: {
        subject: dto.subject,
        content: dto.content,
        preheader: dto.preheader || null,
        senderName: dto.senderName || admin.name || 'Dwellr Team',
        senderEmail: admin.email || null,
        sentById: admin.id,
        sentByName: admin.name || admin.email || 'Admin',
        recipientCount: activeSubscribers.length,
      },
    });

    // Execute email dispatch in batches to optimize throughput
    let deliveredCount = 0;
    let failedCount = 0;

    const batchSize = 10;
    for (let i = 0; i < activeSubscribers.length; i += batchSize) {
      const batch = activeSubscribers.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map(async (sub) => {
          try {
            const html = newsletterBroadcastTemplate({
              subject: dto.subject,
              content: dto.content,
              preheader: dto.preheader,
              senderName: dto.senderName || admin.name || undefined,
              coverImageUrl: dto.coverImageUrl,
              fontFamily: dto.fontFamily,
              recipientEmail: sub.email,
              theme: dto.theme,
            });

            await this.emailService.sendEmail({
              to: sub.email,
              subject: dto.subject,
              html,
            });
            deliveredCount++;
          } catch (err) {
            this.logger.error(`Broadcast failed for ${sub.email}: ${(err as Error).message}`);
            failedCount++;
          }
        }),
      );
    }

    // Update broadcast metrics
    const updatedBroadcast = await this.prisma.newsletterBroadcast.update({
      where: { id: broadcast.id },
      data: {
        deliveredCount,
        failedCount,
      },
    });

    // Update subscriber lastBroadcastAt
    await this.prisma.newsletterSubscriber.updateMany({
      where: { id: { in: activeSubscribers.map((s) => s.id) } },
      data: { lastBroadcastAt: new Date() },
    });

    return {
      message: `Newsletter broadcast sent to ${deliveredCount} subscriber(s).`,
      data: updatedBroadcast,
    };
  }

  // ─── Admin: Broadcasts History ────────────────────────────────────────────
  async getBroadcasts() {
    const broadcasts = await this.prisma.newsletterBroadcast.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50,
    });

    return {
      message: 'Broadcast history retrieved successfully',
      data: broadcasts,
    };
  }

  // ─── Admin: Toggle Status ─────────────────────────────────────────────────
  async toggleSubscriberStatus(id: string, status: NewsletterStatus) {
    const subscriber = await this.prisma.newsletterSubscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    const updated = await this.prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        status,
        unsubscribedAt: status === NewsletterStatus.UNSUBSCRIBED ? new Date() : null,
      },
    });

    return {
      message: `Subscriber status updated to ${status}`,
      data: updated,
    };
  }

  // ─── Admin: Delete Subscriber ─────────────────────────────────────────────
  async deleteSubscriber(id: string) {
    const subscriber = await this.prisma.newsletterSubscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    await this.prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return {
      message: 'Subscriber removed successfully',
    };
  }

  // ─── Admin: Export CSV ────────────────────────────────────────────────────
  async exportSubscribersCsv(): Promise<string> {
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', 'Email', 'Name', 'Source', 'Status', 'Subscribed At', 'Unsubscribed At'];
    const rows = subscribers.map((s) => [
      s.id,
      s.email,
      s.name ? `"${s.name.replace(/"/g, '""')}"` : '',
      s.source || '',
      s.status,
      s.createdAt.toISOString(),
      s.unsubscribedAt ? s.unsubscribedAt.toISOString() : '',
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  private async sendWelcomeEmailSafe(email: string, name?: string) {
    try {
      const html = newsletterWelcomeTemplate(email, name);
      await this.emailService.sendEmail({
        to: email,
        subject: `Welcome to the ${process.env.SITE_NAME || 'Dwellr'} Newsletter!`,
        html,
      });
    } catch (err) {
      this.logger.warn(`Could not send welcome email to ${email}: ${(err as Error).message}`);
    }
  }
}
