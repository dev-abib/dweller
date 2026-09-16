import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';
import {
  SWAGGER_TITLE,
  SWAGGER_VERSION,
  SWAGGER_DESCRIPTION,
  SWAGGER_AUTH_DESCRIPTION,
} from '../constants/swagger.constants';

export function buildSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: SWAGGER_AUTH_DESCRIPTION,
      },
      'bearer',
    )
    .build();

  return SwaggerModule.createDocument(app, config);
}
