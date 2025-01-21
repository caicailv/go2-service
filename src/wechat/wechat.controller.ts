import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common"; // 导入 HttpException 和 HttpStatus
import { WeChatService } from "./wechat.service";
// 🚩
@Controller("wechat")
export class WeChatController {
  constructor(private readonly weChatService: WeChatService) {}

  @Post("login")
  async login(@Body("code") code: string) {
    // 检查前端是否传入了 code 参数
    if (!code) {
      throw new HttpException("缺少 code 参数", HttpStatus.BAD_REQUEST);
    }

    // 调用 WeChatService 的 loginWithCode 方法进行登录
    return await this.weChatService.loginWithCode(code);
  }
}
