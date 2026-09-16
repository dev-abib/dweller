import { SwaggerModule } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';
import { SWAGGER_DOC_PATH } from './constants/swagger.constants';
import { buildSwaggerDocument } from './config/swagger.builder';
import { swaggerCustomOptions } from './config/swagger.options';

/**
 * Initializes and registers Swagger documentation on the NestJS application
 */
export function setupSwagger(app: INestApplication): void {
  const document = buildSwaggerDocument(app);
  SwaggerModule.setup(SWAGGER_DOC_PATH, app, document, swaggerCustomOptions);
}
