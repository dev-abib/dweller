import type { Request, Response, CookieOptions } from 'express';

const MS_MULTIPLIERS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
};

function durationToMs(value: string | undefined, fallbackMs: number): number {
  if (!value) return fallbackMs;
  const match = /^(\d+)\s*(ms|s|m|h|d|w)$/i.exec(value.trim());
  if (!match) return fallbackMs;
  return Number(match[1]) * (MS_MULTIPLIERS[match[2].toLowerCase()] ?? 1);
}

export class CookieHelper {
  private static getCookieOptions(res?: Response, req?: Request): CookieOptions {
    const host = req?.headers?.host || res?.req?.headers?.host || '';
    const origin =
      (req?.headers?.origin as string) ||
      (res?.req?.headers?.origin as string) ||
      '';

    const isLocal =
      process.env.NODE_ENV !== 'production' ||
      host.includes('localhost') ||
      host.includes('127.0.0.1') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1');

    const isProd = process.env.NODE_ENV === 'production' && !isLocal;

    const sameSite: 'none' | 'lax' = isProd ? 'none' : 'lax';
    const secure = isProd;

    return {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
      domain: isProd ? process.env.COOKIE_DOMAIN || '.dwellr.tech' : undefined,
    };
  }

  static setAdminAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    req?: Request,
  ) {
    const options = this.getCookieOptions(res, req);

    // keep cookie lifetimes in sync with the JWT expiry env vars
    const accessMaxAge = durationToMs(
      process.env.JWT_ADMIN_EXPIRES_IN,
      8 * 60 * 60 * 1000,
    );
    const refreshMaxAge = durationToMs(
      process.env.JWT_ADMIN_REFRESH_EXPIRES_IN,
      7 * 24 * 60 * 60 * 1000,
    );

    res.cookie('accessToken', accessToken, {
      ...options,
      maxAge: accessMaxAge,
    });

    res.cookie('refreshToken', refreshToken, {
      ...options,
      maxAge: refreshMaxAge,
    });
  }

  static clearAdminAuthCookies(res: Response, req?: Request) {
    const options = this.getCookieOptions(res, req);

    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);
  }
}


// import { Response, CookieOptions } from 'express';

// export class CookieHelper {
//   private static getCookieOptions(): CookieOptions {
//     const isProd = process.env.NODE_ENV === 'production';

//     return {
//       httpOnly: true,
//       secure: isProd,
//       sameSite: isProd ? 'none' : 'lax',
//       path: '/',
//       domain: isProd ? '.dwellr.tech' : undefined,
//     };
//   }

//   static setAdminAuthCookies(
//     res: Response,
//     accessToken: string,
//     refreshToken: string,
//   ) {
//     const options = this.getCookieOptions();

//     res.cookie('accessToken', accessToken, {
//       ...options,
//       maxAge: 15 * 60 * 1000,
//     });

//     res.cookie('refreshToken', refreshToken, {
//       ...options,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//   }

//   static clearAdminAuthCookies(res: Response) {
//     const options = this.getCookieOptions();

//     res.clearCookie('accessToken', options);
//     res.clearCookie('refreshToken', options);
//   }
// }