import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

const CATEGORY_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', example: 'Favorite Color' },
    icon: {
      type: 'string',
      format: 'binary',
      description: 'Category icon image',
    },
  },
};

export function ApiCreateCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new category (multipart: name + optional icon file)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Category creation payload',
      required: true,
      schema: CATEGORY_SCHEMA,
    }),
  );
}

export function ApiGetAllCategories() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all categories with pagination' }),
  );
}

export function ApiGetCategoryById() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get a category by ID' }),
    ApiParam({ name: 'id', description: 'Category ID' }),
  );
}

export function ApiUpdateCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary:
        'Update a category (multipart: optional name + optional icon file)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Category update payload',
      required: true,
      schema: CATEGORY_SCHEMA,
    }),
  );
}

export function ApiDeleteCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a category by ID' }),
    ApiParam({ name: 'id', description: 'Category ID' }),
  );
}
