import {
  Controller,
  Body,
  Post,
  Get,
  Delete,
  Param,
  HttpCode,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OnsiteReportService } from './onsite-report.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt.types';
import { Auth } from '../auth/decorators/auth.decorator';
import { SubmitOnsiteReportDto } from './helpers/dto/submit-report.dto';
import type { MulterFile } from '../common/pipes/file-validation.pipe';
import {
  ApiSubmitOnsiteReport,
  ApiGetMyOnsiteReports,
  ApiDeleteOnsiteReport,
  ApiGetOnsiteReport,
} from './swagger/onsite-report.swagger';

@ApiTags('Onsite Report')
@ApiBearerAuth()
@Controller('onsite-report')
export class OnsiteReportController {
  constructor(private readonly onsiteReportService: OnsiteReportService) {}

  @Post('submit')
  @Auth('user')
  @ApiSubmitOnsiteReport()
  @UseInterceptors(AnyFilesInterceptor())
  submit(
    @Body() body: SubmitOnsiteReportDto,
    @UploadedFiles() files: MulterFile[],
    @CurrentUser() user: JwtPayload,
  ) {
    return this.onsiteReportService.submitReport(body, user, files);
  }

  @Get('my-reports')
  @Auth('user')
  @ApiGetMyOnsiteReports()
  getMyReports(@CurrentUser() user: JwtPayload) {
    return this.onsiteReportService.getMyReports(user.id);
  }

  // -------------------------------------------------------------------------
  // DELETE /onsite-report/:reportId
  // -------------------------------------------------------------------------
  @Delete(':reportId')
  @Auth('user')
  @HttpCode(200)
  @ApiDeleteOnsiteReport()
  deleteOne(
    @Param('reportId') reportId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ success: boolean; message: string }> {
    return this.onsiteReportService.deleteReport(reportId, user);
  }

  // ==================== DYNAMIC ROUTE - MUST BE LAST ====================
  @Get(':reportId')
  @Auth('user')
  @ApiGetOnsiteReport()
  getOne(@Param('reportId') reportId: string, @CurrentUser() user: JwtPayload) {
    return this.onsiteReportService.getReportById(reportId, user);
  }
}
