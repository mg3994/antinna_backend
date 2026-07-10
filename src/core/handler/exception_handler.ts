import { HttpResponse } from '../http/response';
import { ApiError } from '../exceptions/api_error';
import { ValidationError } from '../exceptions/validation_error';
import { StatusCode } from '../constants/status_code';

export class ExceptionHandler {
  public static handle(err: any, res: HttpResponse): HttpResponse {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({
        success: false,
        status: err.statusCode,
        message: err.message,
        error: err.errorCode,
        validationErrors: err.errors
      });
    }

    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: false,
        status: err.statusCode,
        message: err.message,
        error: err.errorCode
      });
    }

    // Standard fallback
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: StatusCode.INTERNAL_SERVER_ERROR,
      message: err.message || 'An unexpected error occurred',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
}
