import { Module } from '@nestjs/common';
import { ContactQueryService } from './contact-query.service';
import { ContactQueryController } from './contact-query.controller';
import { ChatModule } from '../chat/chat.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [ChatModule, AdminModule],
  controllers: [ContactQueryController],
  providers: [ContactQueryService],
  exports: [ContactQueryService],
})
export class ContactQueryModule {}
