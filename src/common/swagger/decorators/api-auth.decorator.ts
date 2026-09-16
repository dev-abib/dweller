import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

/**
 * Documents standard bearer token auth and common 401/403 error responses
 */
export function ApiAuthProtected(_summary?: string) {
  return applyDecorators(
    ApiBearerAuth('bearer'),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Missing or invalid JWT access token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions for this resource',
    }),
  );
}
