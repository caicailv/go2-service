import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { pool } from './db'

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
  @Post("wxLogin")
  wxLogin(): string {
    return this.appService.wxLogin();
  }

  @Post("getUsers")
  async getUsers() {
    const res = await pool.query("SELECT * FROM users");
    return  res?.[0]
  }
}
