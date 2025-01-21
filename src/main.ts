import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { CustomLoggerService } from './logger.service';  // 引入自定义 Logger
import { AllExceptionsFilter } from './filtetrs/all-exceptions.filter'  // 引入过滤器

import * as dotenv from 'dotenv';
dotenv.config(); 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());  // 启用全局异常过滤器
  await app.listen(3322);
}
bootstrap();
