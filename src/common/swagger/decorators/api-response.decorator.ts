import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export interface ApiSuccessResponseOptions<T = any> {
  status?: number;
  description?: string;
  type?:
    | Type<T>
    | string
    | ((...args: any[]) => any)
    | [(...args: any[]) => any]
    | Record<string, any>;
  isArray?: boolean;
}

/**
 * Documents standard success responses matching ResponseInterceptor envelope:
 * {
 *   success: true,
 *   message: string,
 *   data: T
 * }
 */
export function ApiSuccessResponse<TModel extends Type<any>>(
  options: ApiSuccessResponseOptions<TModel> = {},
) {
  const {
    status = 200,
    description = 'Successful operation',
    type,
    isArray = false,
  } = options;

  let dataSchema: Record<string, any> = { type: 'object', nullable: true };
  const decorators: (MethodDecorator & ClassDecorator)[] = [];

  if (type) {
    if (typeof type === 'function') {
      decorators.push(ApiExtraModels(type));
      const modelRef = { $ref: getSchemaPath(type) };
      dataSchema = isArray ? { type: 'array', items: modelRef } : modelRef;
    } else if (typeof type === 'string') {
      dataSchema = isArray ? { type: 'array', items: { type } } : { type };
    } else if (typeof type === 'object') {
      dataSchema = type;
    }
  }

  return applyDecorators(
    ...decorators,
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
          data: dataSchema,
        },
      },
    }),
  );
}

/**
 * Documents paginated list responses matching pagination envelope
 */
export function ApiPaginatedResponse<TModel extends Type<any>>(
  itemType?: TModel,
  options: { description?: string; status?: number } = {},
) {
  const {
    status = 200,
    description = 'Paginated list retrieved successfully',
  } = options;
  const decorators: (MethodDecorator & ClassDecorator)[] = [];

  let itemsSchema: Record<string, any> = { type: 'object' };
  if (itemType && typeof itemType === 'function') {
    decorators.push(ApiExtraModels(itemType));
    itemsSchema = { $ref: getSchemaPath(itemType) };
  }

  return applyDecorators(
    ...decorators,
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
          data: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: itemsSchema,
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 10 },
                  total: { type: 'number', example: 50 },
                  totalPages: { type: 'number', example: 5 },
                  hasNextPage: { type: 'boolean', example: true },
                  hasPreviousPage: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
      },
    }),
  );
}
