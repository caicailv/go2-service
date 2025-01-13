import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';  // 导入 HttpModule
import { WeChatService } from './wechat.service';  // 引入微信服务
import { WeChatController } from './wechat.controller';  // 引入微信控制器

@Module({
  imports: [HttpModule],  // 在 imports 中添加 HttpModule
  providers: [WeChatService],  // 提供服务
  controllers: [WeChatController],  // 提供控制器
})
export class WeChatModule {}
