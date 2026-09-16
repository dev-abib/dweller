import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AtLeastOneField } from '../../common/decorators/at-least-one-field.decorator';

export class UpdateQuestionDto {
  @AtLeastOneField()
  @ApiPropertyOptional({
    example: 'What is your favorite color?',
    description: 'Question text',
  })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    example: ['Red', 'Blue', 'Green'],
    description: 'List of answer options',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true, message: 'Each option must be a string' })
  @IsOptional()
  options?: string[];

  @ApiPropertyOptional({
    example: 'category-id-here',
    description: 'Category ID the question belongs to',
  })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
