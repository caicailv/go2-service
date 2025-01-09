import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '猫爱吃鱼';
  }
  getHee(): string {
    return 'Hello hee22222222222222222!';
  }
}
