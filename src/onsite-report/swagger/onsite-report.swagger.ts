import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

export function ApiSubmitOnsiteReport() {
  return applyDecorators(
    ApiOperation({ summary: 'Submit an on-site property report with photos' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description:
        'Multipart form-data: address, latitude, longitude, levels (JSON string), photos mapped to elements via field naming',
      schema: {
        type: 'object',
        required: ['address', 'latitude', 'longitude', 'levels'],
        properties: {
          address: { type: 'string', example: '123 Main St, New York, NY' },
          latitude: { type: 'number', example: 40.7128 },
          longitude: { type: 'number', example: -74.006 },
          levels: {
            type: 'string',
            description:
              'JSON stringified array of LevelDto (levelName, levelNumber, elements[]). Elements are flattened into a single array — photos reference elements by their flattened index (0-based).',
            example:
              '[{"levelName":"Ground Floor","levelNumber":0,"elements":[{"categorySlug":"front_entrance","answers":[{"question":"Condition?","selectedOption":"Good"}],"bearingDegrees":180}]}]',
          },
          element_0: {
            type: 'string',
            format: 'binary',
            description:
              'Upload photos using field names like element_0, element_1, etc. The number is the flattened element index (0-based). ' +
              'Send multiple files with the same field name for multiple photos of the same element. ' +
              'Accepted formats: JPEG, PNG, WebP. Max 10MB each.',
          },
        },
        example: {
          address: '123 Main St, New York, NY',
          latitude: '40.7128',
          longitude: '-74.006',
          levels:
            '[{"levelName":"Ground Floor","levelNumber":0,"elements":[{"categorySlug":"front_entrance","answers":[{"question":"Condition?","selectedOption":"Good"}],"bearingDegrees":180}]}]',
          element_0: '(binary) — photo for element index 0 (front_entrance)',
          element_1: '(binary) — photo for element index 1 (kitchen)',
        },
      },
    }),
  );
}

export function ApiGetMyOnsiteReports() {
  return applyDecorators(
    ApiOperation({ summary: 'List all on-site reports for the current user' }),
  );
}

export function ApiDeleteOnsiteReport() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete an on-site report by ID' }),
    ApiParam({
      name: 'reportId',
      description: 'On-site report ID to delete',
      example: 'cmqr3abc123',
    }),
  );
}

export function ApiGetOnsiteReport() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single on-site report by ID' }),
    ApiParam({
      name: 'reportId',
      description: 'On-site report ID',
      example: 'cmqr3abc123',
    }),
  );
}
