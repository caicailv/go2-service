import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { CustomLoggerService } from './logger.service';  // 引入自定义 Logger

import * as dotenv from 'dotenv';
dotenv.config(); 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  // const logger = app.get(CustomLoggerService);  // 获取 CustomLoggerService
  // app.useLogger(logger);  // 使用自定义的 Logger
  await app.listen(3322);
}
console.log('change v1');
console.log(`2`,process.env.UPYUN_SERVICE_NAME);
bootstrap();
