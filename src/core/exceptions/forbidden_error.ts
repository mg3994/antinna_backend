import { ApiError } from './api_error';
import { StatusCode } from '../constants/status_code';

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden', errorCode: string = 'FORBIDDEN') {
    super(StatusCode.FORBIDDEN, message, errorCode);
    this.name = 'ForbiddenError';
  }
}
