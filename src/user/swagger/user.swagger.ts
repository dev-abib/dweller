import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

export function ApiGetMe() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current user profile' }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update user profile with optional profile picture',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'User profile update payload',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'John Doe',
            description: 'User display name (min 4 chars)',
          },
          email: {
            type: 'string',
            example: 'newemail@example.com',
            description: 'User email address',
          },
          userRole: {
            type: 'string',
            example: 'buyer',
            description:
              'User role: buyer, seller, renter, real_estate_agent, brokerage, practitioner, home_explorer, homeowner, investor, interior_designer, architect',
          },
          profilePicture: {
            type: 'string',
            format: 'binary',
            description: 'Profile picture image (JPEG, PNG, WebP, max 5MB)',
          },
        },
      },
    }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user account' }),
  );
}
