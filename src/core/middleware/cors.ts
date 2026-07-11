import { HttpRequest } from '../http/request';
import { HttpResponse } from '../http/response';
import { Middleware } from '../router/router';

export function createCorsMiddleware(allowedOrigins: string = '*'): Middleware {
  return (_req: HttpRequest, res: HttpResponse, next: () => void): void => {
    res.header('Access-Control-Allow-Origin', allowedOrigins);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override, X-API-Key');
    res.header('Access-Control-Max-Age', '86400');

    next();
  };
}
