import { Controller, Get, Post, Body,Headers } from "@nestjs/common";
import { AppService } from "./app.service";
import { pool } from "./db";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/getHee")
  getHee(): string {
    return this.appService.getHee();
  }

  @Post("getUsers")
  async getUsers() {
    const res = await pool.query("SELECT * FROM users");
    return res?.[0];
  }

  // @Post("getUserInfo")
  // async getUserInfo(@Headers('Authorization') authorization: string) {
  //   console.log('authorization',authorization);
  //   return '123'
  //   // SELECT * FROM users WHERE openid = 'your_openid_value';
  // }
  
  @Post("getUserInfo")
  async getUserInfo(@Body('openid') openid: string) {
    console.log('openid',openid);
    const [res] = await pool.query(`SELECT * FROM users WHERE openid = '${openid}'`);
    return res?.[0]  
    // SELECT * FROM users WHERE openid = 'your_openid_value';
  }
}
