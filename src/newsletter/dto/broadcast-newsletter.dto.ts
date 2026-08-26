import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BroadcastNewsletterDto {
  @ApiProperty({ description: 'Subject line of the newsletter', example: 'Exciting Platform Updates & Insights!' })
  @IsString()
  @IsNotEmpty({ message: 'Subject line is required' })
  subject: string;

  @ApiProperty({ description: 'HTML / text content of the newsletter' })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiPropertyOptional({ description: 'Short preheader summary text', example: 'Discover the latest real estate trends and platform updates.' })
  @IsOptional()
  @IsString()
  preheader?: string;

  @ApiPropertyOptional({ description: 'Custom sender name', example: 'Dwellr Team' })
  @IsOptional()
  @IsString()
  senderName?: string;

  @ApiPropertyOptional({ description: 'Cover image URL for the email header', example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({ description: 'Font family style for the newsletter', example: 'playfair' })
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @ApiPropertyOptional({ description: 'Email design theme', example: 'linear_dark' })
  @IsOptional()
  @IsString()
  theme?: 'linear_dark' | 'editorial_light' | 'stripe_modern';
}
