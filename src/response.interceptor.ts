import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 标准化的响应结构
interface StandardResponse<T> {
  code: number;
  msg: string;
  data: T | null;
} 

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const statusCode = response.statusCode; // 获取当前 HTTP 响应状态码
    if (response.statusCode === 201) {
      response.statusCode = 200;
    }
    return next.handle().pipe(
      map((data) => {
        // 动态调整 msg 和 code
        const message = this.getMessage(response.statusCode, data);
        // 返回标准化的响应
        return {
          code: response.statusCode, // 动态设置状态码
          msg: message, // 动态设置消息
          data: data ?? null, // 确保 data 不为 undefined
        };
      }),
    );
  }

  /**
   * 根据状态码和返回数据生成提示信息
   * @param statusCode HTTP 状态码
   * @param data 返回数据
   */
  private getMessage(statusCode: number, data: any): string {
    if (statusCode >= 200 && statusCode < 300) {
      return 'success'; // 成功请求
    } else if (statusCode === 404) {
      return 'Resource not found'; // 未找到资源
    } else if (statusCode >= 400 && statusCode < 500) {
      return 'Client error'; // 客户端错误
    } else if (statusCode >= 500) {
      return 'Server error'; // 服务器错误
    }
    return 'Unhandled status'; // 未处理的状态
  }
}
