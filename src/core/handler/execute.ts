import { HttpRequest } from '../http/request';
import { HttpResponse } from '../http/response';
import { ExceptionHandler } from './exception_handler';
import { RouteHandler } from '../router/endpoint';

export function execute(handler: RouteHandler): RouteHandler {
  return (req: HttpRequest, res: HttpResponse): HttpResponse => {
    try {
      const result = handler(req, res);
      if (result instanceof HttpResponse) {
        return result;
      }
      return res;
    } catch (err) {
      return ExceptionHandler.handle(err, res);
    }
  };
}
