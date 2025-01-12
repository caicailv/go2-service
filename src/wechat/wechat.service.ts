import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // 导入正确的 HttpService
import { AxiosResponse } from 'axios';

@Injectable()
export class WeChatService {
  private readonly appid = 'wxfb182eb8e0fef80e'; // 小程序的 AppID
  private readonly secret = '6ec822d2cc2386ab1bcf224505fae70b'; // 小程序的 AppSecret

  constructor(private readonly httpService: HttpService) {}

  // 获取微信小程序登录信息
  async loginWithCode(code: string): Promise<any> {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.appid}&secret=${this.secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response: AxiosResponse = await this.httpService.get(url).toPromise();
      const data = response.data;

      if (data.errcode) {
        throw new HttpException(data.errmsg, HttpStatus.BAD_REQUEST);
      }

      return {
        openid: data.openid,
        session_key: data.session_key,
      };
    } catch (error) {
      throw new HttpException('微信登录失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
