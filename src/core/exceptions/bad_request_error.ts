import { ApiError } from './api_error';
import { StatusCode } from '../constants/status_code';

export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request', errorCode: string = 'BAD_REQUEST') {
    super(StatusCode.BAD_REQUEST, message, errorCode);
    this.name = 'BadRequestError';
  }
}
