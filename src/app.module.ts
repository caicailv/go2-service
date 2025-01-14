import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseInterceptor } from './response.interceptor'; // 导入拦截器
import { APP_INTERCEPTOR } from '@nestjs/core';
import {WeChatModule } from './wechat/wechat.module'; // 引入微信模块
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
@Module({
  imports: [WeChatModule],
  controllers: [AppController,UploadController],
  providers: [
    AppService,UploadService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, // 设置为全局拦截器
    },
  ],
})
export class AppModule {}