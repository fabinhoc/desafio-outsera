import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const service = app.get(AppService);
  await app.listen(process.env.PORT ?? 3000);
  service.loadDataFromCsv();
}
bootstrap();
