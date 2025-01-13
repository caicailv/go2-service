import { Injectable } from '@nestjs/common';
import { pool } from './db'
import { Controller, Get } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    return '猫爱吃鱼';
  }
  getHee(): string {
    return 'Hello hee22222222222222222!';
  }
  wxLogin() {
    return 'wxLogin';
  }
  async getUsers(){
    return await pool.query('SELECT * FROM users') 
  }
}