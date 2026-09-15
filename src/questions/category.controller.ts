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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetAllCategoriesDto } from './dto/get-all-categories.dto';
import { createFileUploadInterceptor } from '../common/interceptors/file-upload.interceptor';
import { FileValidationPipe } from '../common/pipes/file-validation.pipe';
import type { MulterFile } from '../common/pipes/file-validation.pipe';
import {
  ApiCreateCategory,
  ApiGetAllCategories,
  ApiGetCategoryById,
  ApiUpdateCategory,
  ApiDeleteCategory,
} from './swagger/category.swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // create category controller
  @Post('create-category')
  @Auth('admin')
  @ApiCreateCategory()
  @UseInterceptors(createFileUploadInterceptor({ fieldName: 'icon' }))
  createCategory(
    @UploadedFile(new FileValidationPipe({ required: false }))
    file: MulterFile | undefined,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(dto, file);
  }

  // get all categories controller
  @Get('get-all-categories')
  @Public()
  @ApiGetAllCategories()
  getAllCategories(@Query() dto: GetAllCategoriesDto) {
    return this.categoryService.getAllCategories(dto);
  }

  // get category by ID controller
  @Get(':id')
  @Auth('admin')
  @ApiGetCategoryById()
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  // update category by ID controller
  @Put(':id')
  @Auth('admin')
  @ApiUpdateCategory()
  @UseInterceptors(createFileUploadInterceptor({ fieldName: 'icon' }))
  updateCategoryById(
    @Param('id') id: string,
    @UploadedFile(new FileValidationPipe({ required: false }))
    file: MulterFile | undefined,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategoryById(id, dto, file);
  }

  // delete category by ID controller
  @Delete(':id')
  @Auth('admin')
  @ApiDeleteCategory()
  deleteCategoryById(@Param('id') id: string) {
    return this.categoryService.deleteCategoryById(id);
  }
}
