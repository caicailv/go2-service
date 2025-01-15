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
  async getUsers(){
    return await pool.query('SELECT * FROM users') 
  }

  async updateUserInfo(body:any){
    const {
      userId,
      avatar_url,
      bio,
      gear_setup,
      height,
      weight,
      age,
      region,
      gender,
      gear_setup_img,
      skate_mileage,
      honur_list,  // 新增字段
    } = body;

    let sql = 'UPDATE users SET';
    const values = [];

    if (avatar_url !== undefined) {
      sql += ' avatar_url = ?,';
      values.push(avatar_url);
    }

    if (gear_setup !== undefined) {
      sql += ' gear_setup = ?,';
      values.push(gear_setup);
    }

    if (bio !== undefined) {
      sql += ' bio = ?,';
      values.push(bio);
    }

    if (weight !== undefined) {
      sql += ' weight = ?,';
      values.push(weight);
    }

    if (height !== undefined) {
      sql += ' height = ?,';
      values.push(height);
    }

    if (region !== undefined) {
      sql += ' region = ?,';
      values.push(region);
    }

    if (age !== undefined) {
      sql += ' age = ?,';
      values.push(age);
    }

    if (gender !== undefined) {
      sql += ' gender = ?,';
      values.push(gender);
    }

    if (gear_setup_img !== undefined) {
      sql += ' gear_setup_img = ?,';
      values.push(gear_setup_img);
    }
    if (skate_mileage !== undefined) {
      sql += ' skate_mileage = ?,';
      values.push(skate_mileage);
    }
    if (honur_list !== undefined) {  // 添加 honur_list 字段处理
      sql += ' honur_list = ?,';
      values.push(JSON.stringify(honur_list));  // 将数组转为 JSON 字符串
    }

    // Remove trailing comma
    sql = sql.slice(0, -1);
    sql += ' WHERE id = ?';
    values.push(userId);
    console.log('sql',sql);
    console.log('values',values);
    try {
      await pool.execute(sql, values);
      return { msg: 'ok', status: 200 };
    } catch (error) {
      console.error('Error updating user information:', error);
      return { msg: 'error', status: 500, data: error };
    }

  }
}