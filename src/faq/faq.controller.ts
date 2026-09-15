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
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { GetAllFaqsDto } from './dto/get-all-faqs.dto';
import { createFileUploadInterceptor } from '../common/interceptors/file-upload.interceptor';
import { FileValidationPipe } from '../common/pipes/file-validation.pipe';
import type { MulterFile } from '../common/pipes/file-validation.pipe';
import {
  ApiCreateFaq,
  ApiGetAllFaqs,
  ApiGetFaqById,
  ApiUpdateFaq,
  ApiDeleteFaq,
} from './swagger/faq.swagger';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post('create')
  @Auth('admin')
  @ApiCreateFaq()
  @UseInterceptors(createFileUploadInterceptor({ fieldName: 'image' }))
  createFaq(
    @UploadedFile(new FileValidationPipe({ required: true }))
    file: MulterFile,
    @Body() dto: CreateFaqDto,
  ) {
    return this.faqService.createFaq(dto, file);
  }

  @Get('get-all')
  @Public()
  @ApiGetAllFaqs()
  getAllFaqs(@Query() dto: GetAllFaqsDto) {
    return this.faqService.getAllFaqs(dto);
  }

  @Get(':id')
  @Public()
  @ApiGetFaqById()
  getFaqById(@Param('id') id: string) {
    return this.faqService.getFaqById(id);
  }

  @Put(':id')
  @Auth('admin')
  @ApiUpdateFaq()
  @UseInterceptors(createFileUploadInterceptor({ fieldName: 'image' }))
  updateFaq(
    @Param('id') id: string,
    @UploadedFile(new FileValidationPipe({ required: false }))
    file: MulterFile | undefined,
    @Body() dto: UpdateFaqDto,
  ) {
    return this.faqService.updateFaq(id, dto, file);
  }

  @Delete(':id')
  @Auth('admin')
  @ApiDeleteFaq()
  deleteFaq(@Param('id') id: string) {
    return this.faqService.deleteFaq(id);
  }
}
