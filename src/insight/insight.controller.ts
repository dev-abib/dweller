import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { InsightService } from './insight.service';
import { CreateInsightDto } from './dto/create-insight.dto';
import { UpdateInsightDto } from './dto/update-insight.dto';
import { GetAllInsightsDto } from './dto/get-all-insights.dto';
import { createFileUploadInterceptor } from '../common/interceptors/file-upload.interceptor';
import { FileValidationPipe } from '../common/pipes/file-validation.pipe';
import type { MulterFile } from '../common/pipes/file-validation.pipe';
import {
  ApiCreateInsight,
  ApiGetAllInsights,
  ApiGetInsightById,
  ApiUpdateInsight,
  ApiDeleteInsight,
} from './swagger/insight.swagger';

@ApiTags('Insight')
@Controller('insight')
export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  @Post('create')
  @Auth('admin')
  @ApiCreateInsight()
  @UseInterceptors(createFileUploadInterceptor({ fieldName: 'icon' }))
  createInsight(
    @UploadedFile(new FileValidationPipe({ required: false }))
    file: MulterFile | undefined,
    @Body() dto: CreateInsightDto,
  ) {
    return this.insightService.createInsight(dto, file);
  }

  @Get('get-all')
  @Public()
  @ApiGetAllInsights()
  getAllInsights(@Query() dto: GetAllInsightsDto) {
    return this.insightService.getAllInsights(dto);
  }

  @Get(':id')
  @Public()
  @ApiGetInsightById()
  getInsightById(@Param('id') id: string) {
    return this.insightService.getInsightById(id);
  }

  @Put(':id')
  @Auth('admin')
  @ApiUpdateInsight()
  @UseInterceptors(createFileUploadInterceptor({ fieldName: 'icon' }))
  updateInsight(
    @Param('id') id: string,
    @UploadedFile(new FileValidationPipe({ required: false }))
    file: MulterFile | undefined,
    @Body() dto: UpdateInsightDto,
  ) {
    return this.insightService.updateInsight(id, dto, file);
  }

  @Delete(':id')
  @Auth('admin')
  @ApiDeleteInsight()
  deleteInsight(@Param('id') id: string) {
    return this.insightService.deleteInsight(id);
  }
}
