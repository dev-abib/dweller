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
    title: { type: 'string', example: 'Property Insights' },
    subTitle: { type: 'string', example: 'Understand your property value' },
    description: {
      type: 'string',
      example: 'Get detailed analysis of your property...',
    },
    redirectLink: {
      type: 'string',
      example: '/properties/analysis',
    },
    icon: {
      type: 'string',
      format: 'binary',
      description: 'Insight icon image',
    },
  },
};

export function ApiCreateInsight() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary:
        'Create a new insight (multipart: text fields + optional icon file)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Insight creation payload',
      required: true,
      schema: INSIGHT_SCHEMA,
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
        'Update an insight (multipart: optional text fields + optional icon file)',
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
