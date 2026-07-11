import { HttpResponse } from '../http/response';
import { StatusCode } from '../constants/status_code';

export interface ApiResponseShape<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  metadata?: Record<string, any>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiResponseBuilder {
  private success: boolean = true;
  private statusCode: number = StatusCode.OK;
  private message: string = 'Success';
  private data: any = undefined;
  private metadata?: Record<string, any> = undefined;
  private pagination?: any = undefined;

  public static create(): ApiResponseBuilder {
    return new ApiResponseBuilder();
  }

  public setSuccess(success: boolean): ApiResponseBuilder {
    this.success = success;
    return this;
  }

  public setStatus(code: number): ApiResponseBuilder {
    this.statusCode = code;
    return this;
  }

  public setMessage(msg: string): ApiResponseBuilder {
    this.message = msg;
    return this;
  }

  public setData(data: any): ApiResponseBuilder {
    this.data = data;
    return this;
  }

  public setMetadata(meta: Record<string, any>): ApiResponseBuilder {
    this.metadata = meta;
    return this;
  }

  public setPagination(page: number, limit: number, total: number, totalPages: number): ApiResponseBuilder {
    this.pagination = { page, limit, total, totalPages };
    return this;
  }

  public build(res: HttpResponse): HttpResponse {
    const payload: ApiResponseShape = {
      success: this.success,
      status: this.statusCode,
      message: this.message,
      data: this.data,
      metadata: this.metadata,
      pagination: this.pagination
    };
    return res.status(this.statusCode).json(payload);
  }
}
