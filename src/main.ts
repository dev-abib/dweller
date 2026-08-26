import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import helmet from 'helmet';
import { setupSwagger } from './common/swagger/swagger.setup';
import { join } from 'path';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  // Serve static assets (favicon, etc.)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );
  app.use(cookieParser());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    next();
  });

  const rawAllowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
    'https://q-studieon-dashboard-next.vercel.app',
    'https://admin.dwellr.tech',
    'https://dwellr.tech',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:4000',
    'http://localhost:4923',
    'http://localhost:5555',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed = rawAllowedOrigins.some(
        (allowed) => allowed === origin || origin.endsWith('.vercel.app') || origin.endsWith('.dwellr.tech'),
      );

      if (isAllowed || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive with credentials for smooth custom domain rollout
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  });

  app.set('trust proxy', true);

  app.setGlobalPrefix('api/v1', { exclude: ['api/docs', 'api/docs/(.*)'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  // Swagger configuration
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(
    `App listening on : http://localhost:${process.env.PORT || '3000'}/${`api/v1`}`,
  );
}

void bootstrap();
