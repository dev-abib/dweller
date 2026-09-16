import type { SwaggerCustomOptions } from '@nestjs/swagger';
import {
  SWAGGER_SITE_TITLE,
  SWAGGER_FAVICON,
} from '../constants/swagger.constants';
import { SWAGGER_CUSTOM_CSS } from '../custom-ui/swagger.css';
import { SWAGGER_CUSTOM_JS } from '../custom-ui/swagger.js';

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    docExpansion: 'list',
  },
  customSiteTitle: SWAGGER_SITE_TITLE,
  customfavIcon: SWAGGER_FAVICON,
  customCss: SWAGGER_CUSTOM_CSS,
  customJsStr: SWAGGER_CUSTOM_JS,
};
