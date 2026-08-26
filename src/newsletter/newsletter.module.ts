import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../infra/mail/mail.module';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [NewsletterController],
  providers: [NewsletterService, CloudinaryService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
