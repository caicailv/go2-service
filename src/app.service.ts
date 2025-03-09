import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from "@nestjs/common";
import { pool } from "./db";
import { Controller, Get } from "@nestjs/common";
@Injectable()
export class AppService {
  getHello(): string {
    return "猫爱吃鱼";
  }
  getHee(): string {
    return "Hello hee22222222222222222!";
  }
  async getUsers() {
    return await pool.query("SELECT * FROM users");
  }

  // 管理员创建新用户
  async manageCreateUser(body: any) {
    const {
      nickname,
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
      skate_year,
      honur_list,
    } = body;
  
    const fields: string[] = [];
    const placeholders: string[] = [];
    const values: any[] = [];
  
    // 动态构建字段和占位符
    const addField = (fieldName: string, value: any, isJson = false) => {
      if (value !== undefined) {
        fields.push(fieldName);
        placeholders.push("?");
        values.push(isJson ? JSON.stringify(value) : value);
      }
    };
  
    addField("nickname", nickname);
    addField("avatar_url", avatar_url);
    addField("bio", bio);
    addField("gear_setup", gear_setup);
    addField("height", height);
    addField("weight", weight);
    addField("age", age);
    addField("region", region);
    addField("gender", gender);
    addField("gear_setup_img", gear_setup_img);
    addField("skate_mileage", skate_mileage);
    addField("skate_year", skate_year);
    addField("honur_list", honur_list, true); // 特殊处理 JSON 转换
  
    if (fields.length === 0) {
      throw {
        status: 400,
        msg: "At least one user field must be provided"
      };
    }
  
    const sql = `
      INSERT INTO users 
      (${fields.join(", ")})
      VALUES (${placeholders.join(", ")})
    `;
  
    try {
      const [result] = await pool.execute(sql, values) as any;
      return { 
        userId: result.insertId, // 返回 MySQL 自增 ID
        message: "User created successfully" 
      };
    } catch (error) {
      throw {
        status: 500,
        msg: error?.message || JSON.stringify(error)
      };
    }
  }
  
  
  

  async updateUserInfo(body: any) {
    const {
      userId,
      nickname,
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
      skate_year,
      honur_list, 
    } = body;

    let sql = "UPDATE users SET";
    const values = [];
    if (avatar_url !== undefined) {
      sql += " nickname = ?,";
      values.push(nickname);
    }
    if (avatar_url !== undefined) {
      sql += " avatar_url = ?,";
      values.push(avatar_url);
    }

    if (gear_setup !== undefined) {
      sql += " gear_setup = ?,";
      values.push(gear_setup);
    }

    if (bio !== undefined) {
      sql += " bio = ?,";
      values.push(bio);
    }

    if (weight !== undefined) {
      sql += " weight = ?,";
      values.push(weight);
    }

    if (height !== undefined) {
      sql += " height = ?,";
      values.push(height);
    }

    if (region !== undefined) {
      sql += " region = ?,";
      values.push(region);
    }

    if (age !== undefined) {
      sql += " age = ?,";
      values.push(age);
    }

    if (gender !== undefined) {
      sql += " gender = ?,";
      values.push(gender);
    }

    if (gear_setup_img !== undefined) {
      sql += " gear_setup_img = ?,";
      values.push(gear_setup_img);
    }
    if (skate_mileage !== undefined) {
      sql += " skate_mileage = ?,";
      values.push(skate_mileage);
    }
    if (skate_year !== undefined) {
      sql += " skate_year = ?,";
      values.push(skate_year);
    }

    // 
    if (honur_list !== undefined) {
      // 添加 honur_list 字段处理
      sql += " honur_list = ?,";
      values.push(JSON.stringify(honur_list)); // 将数组转为 JSON 字符串
    }

    // Remove trailing comma
    sql = sql.slice(0, -1);
    sql += " WHERE id = ?";
    values.push(userId);
    console.log("sql", sql);
    console.log("values", values);
    try {
      await pool.execute(sql, values);
      return 
    } catch (error) {
      throw  {
        status:500,
        msg:error?.message||JSON.stringify(error)
      }
    }
  }

  async editMap(body: any) {
    const {
      id,
      name,
      description,
      route_length,
      region,
      smooth,
      convenience,
      star,
      road_file,
      description_imgs,
    } = body;
    const fields = {
      name,
      description,
      route_length,
      region,
      smooth,
      convenience,
      star,
      road_file,
      description_imgs,
    };

    // 过滤掉值为 undefined 的字段
    const updatedFields = Object.keys(fields).filter(
      (key) => fields[key] !== undefined
    );
    const values = updatedFields.map((key) => fields[key]);
    if (id) return await this.updateMaps(updatedFields, values, id);
    return await this.insertMaps(updatedFields, values);
  }
  async insertMaps(updatedFields: any, values: any) {
    const insertClause = updatedFields.join(", ");
    const insertValues = updatedFields.map((_, idx) => `?`).join(", ");
    let sql = `INSERT INTO maps (${insertClause}) VALUES (${insertValues});`;
    await pool.execute(sql, values);
  }
  async updateMaps(updatedFields: any, values, id: any) {
    const setClause = updatedFields.map((key) => `${key} = ?`).join(", ");
    values.push(id); // 将 id 添加到值的数组中，作为 WHERE 子句的条件
    const sql = `UPDATE maps SET ${setClause} WHERE id = ?;`;
    // 执行更新操作
    await pool.execute(sql, values);
    return;
  }

  async getMapList({ id }) {
    let sql = "SELECT * FROM maps";
    if (id) {
      sql += ` WHERE id = ${id}`;
    }
    const [res] = await pool.query(sql);
    console.log('getMapList res',res);
    return res;
  }

  // 点亮地图
  async setLightMap({ openid, mapid }) {
    const [res] = await pool.query(
      `SELECT * FROM users WHERE openid = '${openid}' `
    );
    // @ts-ignore
    let lit_map = res[0].lit_map;
    if (!lit_map) lit_map = [];
    if (lit_map.includes(Number(mapid))) {
      // 删除已点亮的地图
      lit_map = lit_map.filter((item) => item !== Number(mapid));
    } else {
      lit_map.push(mapid);
    }
    let sql = `UPDATE users SET lit_map = ? WHERE openid = '${openid}'`;
    await pool.execute(sql, [JSON.stringify(lit_map)]);
    return;
  }
}
