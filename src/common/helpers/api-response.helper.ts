import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../api-response.interface';

@Injectable()
export class ApiResponseService {
  success<T>(message = 'OK', data?: T): ApiResponse<T> {
    return {
      status: 'success',
      message,
      data,
    };
  }

  error(
    message = 'Error',
    statusCode = 400,
    errors: any = null,
  ): ApiResponse<null> {
    return {
      status: 'error',
      message,
      statusCode,
      errors,
    };
  }
}
