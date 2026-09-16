import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';

export function ApiGoogleLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login with Google OAuth (optionally convert guest account)',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description:
              'Google OAuth access token obtained from the Google OAuth frontend flow',
            example: 'ya29.a0AeO...',
          },
          guestId: {
            type: 'string',
            description:
              'Guest ID to convert a guest session into a permanent Google account',
            example: 'guest_abc123',
          },
        },
        required: ['token'],
      },
    }),
  );
}

export function ApiAppleLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login with Apple OAuth (optionally convert guest account)',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description:
              'Apple identity token obtained from the Apple Sign-In frontend flow',
            example: 'eyJraWQiOi...',
          },
          guestId: {
            type: 'string',
            description:
              'Guest ID to convert a guest session into a permanent Apple account',
            example: 'guest_abc123',
          },
        },
        required: ['token'],
      },
    }),
  );
}
