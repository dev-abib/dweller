import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SuspiciousScanService } from './suspicious-scan.service';
import { AdminModule } from '../admin/admin.module';
import { PushModule } from '../push/push.module';

@Module({
  imports: [
    JwtModule.register({}),
    MulterModule.register({ storage: memoryStorage() }),
    PushModule,
    AdminModule,
  ],
  providers: [ChatGateway, ChatService, SuspiciousScanService],
  controllers: [ChatController],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
