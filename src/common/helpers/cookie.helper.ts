import { Response, CookieOptions } from 'express';

export class CookieHelper {
  private static getCookieOptions(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: isProd ? (process.env.COOKIE_DOMAIN || '.dwellr.tech') : undefined,
    };
  }

  static setAdminAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const options = this.getCookieOptions();

    res.cookie('accessToken', accessToken, {
      ...options,
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Also set fallback indicator cookie
    res.cookie('admin_auth', '1', {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static clearAdminAuthCookies(res: Response) {
    const options = this.getCookieOptions();

    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);
    res.clearCookie('admin_auth', { path: '/' });
  }
}