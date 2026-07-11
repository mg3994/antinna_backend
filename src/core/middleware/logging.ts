import { HttpRequest } from '../http/request';
import { HttpResponse } from '../http/response';
import { Middleware } from '../router/router';
import { ConsoleLogger } from '../logger/console_logger';

export function createLoggingMiddleware(): Middleware {
  const logger = new ConsoleLogger();

  return (req: HttpRequest, res: HttpResponse, next: () => void): void => {
    logger.info(`Incoming Request: ${req.method} ${req.path}`);

    // Call next middleware/handler
    next();

    logger.info(`Response Dispatched: status ${res.getStatus()}`);
  };
}
