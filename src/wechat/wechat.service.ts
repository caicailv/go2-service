import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios"; // 导入正确的 HttpService
import { AxiosResponse } from "axios";
import { Logger } from "@nestjs/common";
import { pool } from "../db";

const logger = new Logger("AppService");

@Injectable()
export class WeChatService {
  private readonly appid = process.env.WE_CHAT_APP_ID;
  private readonly secret = process.env.WE_CHAT_SECRET; // 小程序的 AppSecret
  constructor(private readonly httpService: HttpService) {}

  // 添加用户
  async addUser(openid) {
    const res = await pool.query(
      `INSERT INTO users (openid) VALUES ('${openid}');`
    );
    const res2 = await pool.query(
      `SELECT * FROM users WHERE openid = '${openid}'`
    );
    console.log("res2", res2);
    // @ts-ignore
    return res2[0].id;
  }

  // 获取微信小程序登录信息
  async loginWithCode(code: string): Promise<any> {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.appid}&secret=${this.secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response: AxiosResponse = await this.httpService
        .get(url)
        .toPromise();
      const data = response.data;

      if (data.errcode) {
        throw new HttpException(data.errmsg, HttpStatus.BAD_REQUEST);
      }
      const { openid } = data;
      let id;
      const [res] = await pool.query(
        `SELECT * FROM users WHERE openid = '${openid}'`
      );
      if (res?.[0]) {
        id = res[0].id;
      } else {
        id = await this.addUser(openid);
      }

      return { id, openid, session_key: data.session_key };
    } catch (error) {
      console.log("error", error);
      throw new HttpException("微信登录失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
