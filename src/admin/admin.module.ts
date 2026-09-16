import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthHelper } from '../auth/helpers/auth.helper';
import { UserModule } from '../user/user.module';
import { AuditService } from './audit.service';
import { PresenceService } from './presence.service';
import { SecurityAlertService } from './security-alert.service';
import { InternalNotesService } from './internal-notes.service';
import { SystemStatusService } from './system-status.service';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    AuditService,
    PresenceService,
    SecurityAlertService,
    InternalNotesService,
    SystemStatusService,
    AuthHelper,
  ],
  exports: [
    AuditService,
    AdminService,
    PresenceService,
    SecurityAlertService,
    InternalNotesService,
    SystemStatusService,
  ],
})
export class AdminModule {}
