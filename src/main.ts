import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import logger from 'constants/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.setGlobalPrefix('v1');
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173', 'https://staging.edalmar.com'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(8080);
}
bootstrap();
