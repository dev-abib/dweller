import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubscribeNewsletterDto {
  @ApiProperty({ description: 'Subscriber email address', example: 'subscriber@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @ApiPropertyOptional({ description: 'Optional subscriber name', example: 'Alex Morgan' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Source of the subscription', example: 'website_footer' })
  @IsOptional()
  @IsString()
  source?: string;
}

export class UnsubscribeNewsletterDto {
  @ApiProperty({ description: 'Subscriber email to unsubscribe', example: 'subscriber@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;
}
