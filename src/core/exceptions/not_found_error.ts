import { ApiError } from './api_error';
import { StatusCode } from '../constants/status_code';

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource Not Found', errorCode: string = 'NOT_FOUND') {
    super(StatusCode.NOT_FOUND, message, errorCode);
    this.name = 'NotFoundError';
  }
}
