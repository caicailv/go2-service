import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'; // 导入 HttpException 和 HttpStatus
import { WeChatService } from './wechat.service';
// 🚩
@Controller('wechat')
export class WeChatController {
  constructor(private readonly weChatService: WeChatService) {}

  @Post('login')
  async login(@Body('code') code: string) {
    // 检查前端是否传入了 code 参数
    if (!code) {
      throw new HttpException('缺少 code 参数', HttpStatus.BAD_REQUEST);
    }

    // 调用 WeChatService 的 loginWithCode 方法进行登录
    const loginData = await this.weChatService.loginWithCode(code);

    // 返回标准的 JSON 响应格式
    return {
      code: 200,
      msg: '登录成功',
      data: loginData,
    };
  }
}

/* 

docker run -d \
  --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=1309055307 \
  -e MYSQL_DATABASE=ldp_database \
  -p 3306:3306 \
  -v /path/to/mysql/data:/var/lib/mysql \
  mysql:latest

docker exec -it 05013efbe8c3  bash


  docker run -d \
  --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=your_database \
  -e MYSQL_USER=your_user \
  -e MYSQL_PASSWORD=your_user_password \
  -p 3306:3306 \
  -v /path/to/mysql/data:/var/lib/mysql \
  mysql:latest
*/