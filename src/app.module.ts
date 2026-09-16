import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './infra/mail/mail.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AdminModule } from './admin/admin.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TasksModule } from './tasks/tasks.module';
import { DynamicPageModule } from './dynamic-page/dynamic-page.module';
import { ReportModule } from './report/report.module';
import { OnsiteReportModule } from './onsite-report/onsite-report.module';
import { CollectionModule } from './collection/collection.module';
import { QuestionsModule } from './questions/questions.module';
import { InsightModule } from './insight/insight.module';
import { SharedReportModule } from './shared-report/shared-report.module';
import { FaqModule } from './faq/faq.module';
import { ContactQueryModule } from './contact-query/contact-query.module';
import { ChatModule } from './chat/chat.module';
import { TaskManagerModule } from './task-manager/task-manager.module';
import { PushModule } from './push/push.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    CommonModule,
    PrismaModule,
    AuthModule,
    MailModule,
    UserModule,
    AdminModule,
    SubscriptionModule,
    TasksModule,
    DynamicPageModule,
    ReportModule,
    OnsiteReportModule,
    CollectionModule,
    QuestionsModule,
    SharedReportModule,
    InsightModule,
    FaqModule,
    ContactQueryModule,
    ChatModule,
    TaskManagerModule,
    PushModule,
    NewsletterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
