export const SWAGGER_TITLE = 'Q-Studieon API';
export const SWAGGER_VERSION = '1.0';
export const SWAGGER_DOC_PATH = 'api/docs';
export const SWAGGER_SITE_TITLE = 'Q-Studieon API Docs';
export const SWAGGER_FAVICON = '/favicon.svg';

export const SWAGGER_AUTH_DESCRIPTION = [
  'Paste your JWT access token here.',
  '',
  'To get a token:',
  '  \u2022 User login:  POST /api/v1/auth/user/login',
  '  \u2022 Admin login: POST /api/v1/auth/admin/login',
  '  \u2022 Register:    POST /api/v1/auth/user/register',
  '',
  'The token is in the response under data.token.accessToken (user) or data.tokens.accessToken (admin).',
].join('\n');

export const SWAGGER_DESCRIPTION = [
  'API documentation for Q-Studieon',
  '',
  '---',
  '### \u{1F511} How to authenticate',
  '',
  '**1. Get your token** — Call one of these login endpoints:',
  '',
  '| Endpoint | Request body | Token location |',
  '|---|---|---|',
  '| `POST /api/v1/auth/user/login` | `{ "email": "...", "password": "..." }` | `response.data.token.accessToken` |',
  '| `POST /api/v1/auth/admin/login` | `{ "email": "...", "password": "..." }` | `response.data.tokens.accessToken` |',
  '| `POST /api/v1/auth/user/register` | `{ "name", "email", "password", ... }` | `response.data.token.accessToken` |',
  '| `POST /api/v1/auth/user/guest-login` | _(no body required — sends headers)_ | `response.data.accessToken` |',
  '| `POST /api/v1/auth/user/google-login` | `{ "token": "..." }` | `response.data.token.accessToken` |',
  '| `POST /api/v1/auth/user/apple-login` | `{ "token": "..." }` | `response.data.token.accessToken` |',
  '',
  '**2. Authorize** — Click the **Authorize** button at the top right, paste only the `accessToken` value (the JWT string), and click **Authorize**.',
  '',
  '**3. Test protected routes** — Locked endpoints will now send your token automatically.',
].join('\n');
