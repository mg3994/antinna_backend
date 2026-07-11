import { HttpResponse } from '../http/response';
import { StatusCode } from '../constants/status_code';

export interface ApiErrorResponseShape {
  success: boolean;
  status: number;
  message: string;
  error: string;
  validationErrors?: Record<string, string[]>;
}

export class ApiErrorBuilder {
  private statusCode: number = StatusCode.BAD_REQUEST;
  private message: string = 'An error occurred';
  private errorCode: string = 'ERROR';
  private validationErrors?: Record<string, string[]> = undefined;

  public static create(): ApiErrorBuilder {
    return new ApiErrorBuilder();
  }

  public setStatus(code: number): ApiErrorBuilder {
    this.statusCode = code;
    return this;
  }

  public setMessage(msg: string): ApiErrorBuilder {
    this.message = msg;
    return this;
  }

  public setErrorCode(code: string): ApiErrorBuilder {
    this.errorCode = code;
    return this;
  }

  public setValidationErrors(errors: Record<string, string[]>): ApiErrorBuilder {
    this.validationErrors = errors;
    this.statusCode = StatusCode.UNPROCESSABLE_ENTITY;
    return this;
  }

  public build(res: HttpResponse): HttpResponse {
    const payload: ApiErrorResponseShape = {
      success: false,
      status: this.statusCode,
      message: this.message,
      error: this.errorCode,
      validationErrors: this.validationErrors
    };
    return res.status(this.statusCode).json(payload);
  }
}
