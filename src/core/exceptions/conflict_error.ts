import { ApiError } from './api_error';
import { StatusCode } from '../constants/status_code';

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict occurred', errorCode: string = 'CONFLICT') {
    super(StatusCode.CONFLICT, message, errorCode);
    this.name = 'ConflictError';
  }
}
