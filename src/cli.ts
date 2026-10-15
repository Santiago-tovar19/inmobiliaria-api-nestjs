import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: console,
  });

  app.select(CommandModule); // selecciona el módulo de comandos

  // Ejecuta el comando desde la CLI
  const commandService = app.get(CommandService);
  await commandService.exec();

  await app.close();
}

bootstrap();
