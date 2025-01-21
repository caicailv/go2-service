import { Controller, Get, Post, Body, Headers } from "@nestjs/common";
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

  @Post("updateUserInfo")
  async updateUserInfo(@Body() body: any) {
    return await this.appService.updateUserInfo(body);
  }
  @Post("editMap")
  async editMap(@Body() body: any) {
    return await this.appService.editMap(body);
  }
  @Post("getUserInfo")
  async getUserInfo(@Body("openid") openid: string) {
    const [res] = await pool.query(
      `SELECT * FROM users WHERE openid = '${openid}'`
    );
    return res?.[0];
  }

  @Post("getMapList")
  async getMapList(@Body("id") id: string) {
    return await this.appService.getMapList({ id });
  }
  @Post("setLightMap")
  async setLightMap(
    @Headers("Authorization") openid: string,
    @Body("mapid") mapid: string,
  ) {
    return await this.appService.setLightMap({ openid, mapid });
  }
}
