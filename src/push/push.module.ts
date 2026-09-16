import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PushService } from './push.service';
import { PushController } from './push.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule {}
