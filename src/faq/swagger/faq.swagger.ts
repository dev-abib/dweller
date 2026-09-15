import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiCreateFaq() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new FAQ (multipart: text fields + required image file)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'FAQ creation payload',
      required: true,
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'How do I generate a report?',
          },
          description: {
            type: 'string',
            example:
              'Open the Reports tab, tap "Generate", and follow the steps...',
          },
          sortOrder: {
            type: 'number',
            example: 1,
            description: 'Display order (lower numbers appear first)',
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'FAQ image',
          },
        },
        required: ['title', 'description', 'image'],
      },
    }),
  );
}

export function ApiGetAllFaqs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all FAQs with pagination' }),
  );
}

export function ApiGetFaqById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a FAQ by ID' }),
    ApiParam({ name: 'id', description: 'FAQ ID' }),
  );
}

export function ApiUpdateFaq() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary:
        'Update a FAQ (multipart: optional text fields + optional image file)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'FAQ update payload',
      required: true,
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'How do I generate a report?' },
          description: {
            type: 'string',
            example:
              'Open the Reports tab, tap "Generate", and follow the steps...',
          },
          sortOrder: {
            type: 'number',
            example: 1,
            description: 'Display order (lower numbers appear first)',
          },
          image: {
            type: 'string',
            format: 'binary',
            description: 'FAQ image',
          },
        },
      },
    }),
  );
}

export function ApiDeleteFaq() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a FAQ by ID' }),
    ApiParam({ name: 'id', description: 'FAQ ID' }),
  );
}
