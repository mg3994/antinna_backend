import { ApiError } from './api_error';
import { StatusCode } from '../constants/status_code';

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation Failed', public errors: Record<string, string[]> = {}, errorCode: string = 'VALIDATION_FAILED') {
    super(StatusCode.UNPROCESSABLE_ENTITY, message, errorCode);
    this.name = 'ValidationError';
  }
}
