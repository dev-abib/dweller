import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiExtraModels } from '@nestjs/swagger';

export interface ApiFileUploadOptions {
  summary?: string;
  fieldName?: string;
  required?: boolean;
  description?: string;
  bodyDto?: Type<any>;
  additionalProperties?: Record<string, any>;
}

/**
 * Documents multipart/form-data single file upload endpoints
 */
export function ApiSingleFileUpload(options: ApiFileUploadOptions = {}) {
  const {
    fieldName = 'file',
    required = true,
    description = 'File upload payload',
    bodyDto,
    additionalProperties = {},
  } = options;

  const decorators: (MethodDecorator & ClassDecorator)[] = [
    ApiConsumes('multipart/form-data'),
  ];

  if (bodyDto) {
    decorators.push(ApiExtraModels(bodyDto));
  }

  const properties: Record<string, any> = {
    [fieldName]: {
      type: 'string',
      format: 'binary',
      description: `${fieldName} file`,
    },
    ...additionalProperties,
  };

  const requiredFields = required ? [fieldName] : [];

  return applyDecorators(
    ...decorators,
    ApiBody({
      description,
      required: true,
      schema: {
        type: 'object',
        properties,
        ...(requiredFields.length > 0 ? { required: requiredFields } : {}),
      },
    }),
  );
}

/**
 * Documents multipart/form-data multiple files upload endpoints
 */
export function ApiMultipleFileUpload(options: ApiFileUploadOptions = {}) {
  const {
    fieldName = 'files',
    required = true,
    description = 'Multiple files upload payload',
    bodyDto,
    additionalProperties = {},
  } = options;

  const decorators: (MethodDecorator & ClassDecorator)[] = [
    ApiConsumes('multipart/form-data'),
  ];

  if (bodyDto) {
    decorators.push(ApiExtraModels(bodyDto));
  }

  const properties: Record<string, any> = {
    [fieldName]: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
      description: `${fieldName} files`,
    },
    ...additionalProperties,
  };

  const requiredFields = required ? [fieldName] : [];

  return applyDecorators(
    ...decorators,
    ApiBody({
      description,
      required: true,
      schema: {
        type: 'object',
        properties,
        ...(requiredFields.length > 0 ? { required: requiredFields } : {}),
      },
    }),
  );
}
