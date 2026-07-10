import { HttpResponse } from '../http/response';
import { StatusCode } from '../constants/status_code';

export class ResponseHandler {
  public static ok(res: HttpResponse, data: any, message: string = 'Success'): HttpResponse {
    return res.status(StatusCode.OK).json({
      success: true,
      status: StatusCode.OK,
      message,
      data
    });
  }

  public static created(res: HttpResponse, data: any, message: string = 'Created successfully'): HttpResponse {
    return res.status(StatusCode.CREATED).json({
      success: true,
      status: StatusCode.CREATED,
      message,
      data
    });
  }

  public static error(res: HttpResponse, statusCode: number, message: string, error: string): HttpResponse {
    return res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      error
    });
  }
}
