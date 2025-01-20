import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as dayjs from 'dayjs';
import { Service, Client } from 'upyun';
import { Express } from 'express';  // 这是关键，导入Express类型
console.log('UPYUN_SERVICE_NAME',process.env.UPYUN_SERVICE_NAME);
@Injectable()
export class UploadService {
  private serviceName = process.env.UPYUN_SERVICE_NAME;
  private operatorName = process.env.UPYUN_OPERATOR_NAME;
  private operatorPassword = process.env.UPYUN_OPERATOR_PASSWORD;
  private domainName = process.env.UPYUN_DOMAIN_NAME;

  private service: Service;
  private client: Client;

  constructor() {
    this.service = new Service(
      this.serviceName,
      this.operatorName,
      this.operatorPassword,
    );
    this.client = new Client(this.service);
  }

  private generateSixDigitRandomNumber(): string {
    return Math.random().toString().substr(3, 6);
  }

  private generateUniqueFileName(originalName: string): string {
    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    const randomString = this.generateSixDigitRandomNumber();
    const extension = path.extname(originalName);
    return `ccl-${timestamp}-${randomString}${extension}`;
  }

  async uploadImage(localFilePath: string, imgPath: string): Promise<any> {
    const key = imgPath ? `${imgPath}/${path.basename(localFilePath)}` : path.basename(localFilePath);
    try {
      const file = await fs.promises.readFile(localFilePath);
      const result = await this.client.putFile(key, file);
      if (result) {
        return { key: `${this.domainName}/${key}` };
      } else {
        throw new Error('Upload to UPYUN failed');
      }
    } catch (error) {
      throw error;
    }
  }

  async saveFile(file: Express.Multer.File, imgPath: string): Promise<any> {
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'upload-'));
    const uniqueFileName = this.generateUniqueFileName(file.originalname);
    const tempFilePath = path.join(tempDir, uniqueFileName);
    await fs.promises.writeFile(tempFilePath, file.buffer);

    return this.uploadImage(tempFilePath, imgPath);
  }
}
