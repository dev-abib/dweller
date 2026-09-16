import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

const INSIGHT_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      example: 'Understanding Home Inspection Reports',
    },
    description: {
      type: 'string',
      example: 'A comprehensive guide to reading and understanding...',
    },
    sortOrder: {
      type: 'number',
      example: 1,
      description: 'Display order (lower numbers appear first)',
    },
    image: {
      type: 'string',
      format: 'binary',
      description: 'Insight image',
    },
  },
};

export function ApiCreateInsight() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary:
        'Create a new insight (multipart: text fields + optional image file)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Insight creation payload',
      required: true,
      schema: {
        ...INSIGHT_SCHEMA,
        required: ['title', 'description'],
      },
    }),
  );
}

export function ApiGetAllInsights() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all insights with pagination' }),
  );
}

export function ApiGetInsightById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get an insight by ID' }),
    ApiParam({ name: 'id', description: 'Insight ID' }),
  );
}

export function ApiUpdateInsight() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary:
        'Update an insight (multipart: optional text fields + optional image file)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Insight update payload',
      required: true,
      schema: INSIGHT_SCHEMA,
    }),
  );
}

export function ApiDeleteInsight() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an insight by ID' }),
    ApiParam({ name: 'id', description: 'Insight ID' }),
  );
}
