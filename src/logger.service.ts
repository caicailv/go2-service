import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends Logger implements LoggerService {
  // 重写 log 方法
  log(message: string) {
    super.log(message);  // 调用 NestJS 内置的 Logger.log() 方法
    console.log(message); // 保持 console.log 的输出
  }

  error(message: string, trace: string) {
    super.error(message, trace);  // 调用 NestJS 内置的 Logger.error() 方法
    console.error(message, trace); // 保持 console.error 的输出
  }

  warn(message: string) {
    super.warn(message);  // 调用 NestJS 内置的 Logger.warn() 方法
    console.warn(message); // 保持 console.warn 的输出
  }

  debug(message: string) {
    super.debug(message);  // 调用 NestJS 内置的 Logger.debug() 方法
    console.debug(message); // 保持 console.debug 的输出
  }

  verbose(message: string) {
    super.verbose(message);  // 调用 NestJS 内置的 Logger.verbose() 方法
    console.log(message); // 保持 console.log 的输出
  }
}
