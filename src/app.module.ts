import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseInterceptor } from './response.interceptor'; // 导入拦截器
import { APP_INTERCEPTOR } from '@nestjs/core';
import {WeChatModule } from './wechat/wechat.module'; // 引入微信模块

@Module({
  imports: [WeChatModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, // 设置为全局拦截器
    },
  ],
})
export class AppModule {}