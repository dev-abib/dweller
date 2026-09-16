import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserService } from '../user/user.service';
import { AuditService } from './audit.service';
import { PresenceService } from './presence.service';
import { SecurityAlertService } from './security-alert.service';
import { InternalNotesService } from './internal-notes.service';
import { SystemStatusService } from './system-status.service';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getMeAdmin: jest.fn(),
            getAllAdminsUsers: jest.fn(),
            createAdmin: jest.fn(),
            updateAdmin: jest.fn(),
            deleteAdminOrUser: jest.fn(),
            getDashboardAnalytics: jest.fn(),
            sendAdminMail: jest.fn(),
          },
        },
        { provide: UserService, useValue: { getMe: jest.fn() } },
        { provide: AuditService, useValue: { logAction: jest.fn(), queryLogs: jest.fn() } },
        { provide: PresenceService, useValue: { recordHeartbeat: jest.fn(), getActiveViewers: jest.fn() } },
        { provide: SecurityAlertService, useValue: { getAlerts: jest.fn(), dismissAlert: jest.fn() } },
        { provide: InternalNotesService, useValue: { addNote: jest.fn(), getNotes: jest.fn() } },
        { provide: SystemStatusService, useValue: { getStatus: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
