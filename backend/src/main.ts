import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173', // your frontend
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept'],
  });
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // This will make files accessible via /uploads/filename
  });
  await app.listen(3000);
}
bootstrap();
