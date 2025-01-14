import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Express } from 'express';  // 这是关键，导入Express类型
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('path') imgPath: string,
    @Body('name') fileName: string,
  ) {
    if (!file) {
      return { status: 500, msg: 'No file uploaded' };
    }

    try {
      const result = await this.uploadService.saveFile(file, imgPath);
      return {
        msg: 'ok',
        status: 200,
        data: { url: result.key },
      };
    } catch (error) {
      console.error('Error during file upload', error);
      return { msg: 'error', status: 500, data: error };
    }
  }
}
