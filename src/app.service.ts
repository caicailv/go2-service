import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello getHello!';
  }
  getHee(): string {
    return 'Hello hee22222222222222222!';
  }
}
