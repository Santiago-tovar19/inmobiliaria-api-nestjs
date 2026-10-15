import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exeptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // o '*' temporalmente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  await app.listen(4000);
}

bootstrap();
