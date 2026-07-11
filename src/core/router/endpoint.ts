import { HttpRequest } from '../http/request';
import { HttpResponse } from '../http/response';

export type RouteHandler = (req: HttpRequest, res: HttpResponse) => void | HttpResponse;

export interface IRoute {
  method: string;
  path: string;
  handler: RouteHandler;
  matches(method: string, path: string): boolean;
  extractParams(path: string): Record<string, string>;
}
