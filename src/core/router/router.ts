import { HttpRequest } from '../http/request';
import { HttpResponse } from '../http/response';
import { Route } from './route';
import { RouteHandler } from './endpoint';
import { StatusCode } from '../constants/status_code';

export type Middleware = (req: HttpRequest, res: HttpResponse, next: () => void) => void;

export class Router {
  private routes: Route[] = [];
  private middlewares: Middleware[] = [];

  public use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  public get(path: string, handler: RouteHandler): void {
    this.routes.push(new Route('GET', path, handler));
  }

  public post(path: string, handler: RouteHandler): void {
    this.routes.push(new Route('POST', path, handler));
  }

  public put(path: string, handler: RouteHandler): void {
    this.routes.push(new Route('PUT', path, handler));
  }

  public delete(path: string, handler: RouteHandler): void {
    this.routes.push(new Route('DELETE', path, handler));
  }

  public handle(req: HttpRequest, res: HttpResponse): HttpResponse {
    // 1. Find matching route
    let matchedRoute: Route | null = null;
    for (const route of this.routes) {
      if (route.matches(req.method, req.path)) {
        matchedRoute = route;
        break;
      }
    }

    if (!matchedRoute) {
      return res.status(StatusCode.NOT_FOUND).json({
        success: false,
        status: StatusCode.NOT_FOUND,
        message: `Route not found for ${req.method} ${req.path}`,
        error: 'NOT_FOUND'
      });
    }

    // Parse path parameters and set them on the request object
    const params = matchedRoute.extractParams(req.path);
    req.setParams(params);

    // 2. Execute middlewares, then handler
    let middlewareIndex = 0;

    const executeNext = (): void => {
      if (middlewareIndex < this.middlewares.length) {
        const currentMiddleware = this.middlewares[middlewareIndex++];
        currentMiddleware(req, res, executeNext);
      } else {
        // All middlewares passed, run handler
        matchedRoute!.handler(req, res);
      }
    };

    try {
      executeNext();
    } catch (err: any) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: StatusCode.INTERNAL_SERVER_ERROR,
        message: err.message || 'An unexpected error occurred during request execution',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }

    return res;
  }
}
