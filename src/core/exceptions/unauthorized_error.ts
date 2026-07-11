import { ApiError } from './api_error';
import { StatusCode } from '../constants/status_code';

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', errorCode: string = 'UNAUTHORIZED') {
    super(StatusCode.UNAUTHORIZED, message, errorCode);
    this.name = 'UnauthorizedError';
  }
}
