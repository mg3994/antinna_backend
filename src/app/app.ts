import { Router } from '../core/router/router';
import { HttpRequest } from '../core/http/request';
import { HttpResponse } from '../http/response';

export class Application {
  private router: Router;
  private services: Map<string, any> = new Map();

  constructor() {
    this.router = new Router();
  }

  public getRouter(): Router {
    return this.router;
  }

  public registerService<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  public getService<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found in application context.`);
    }
    return service as T;
  }

  public handleRequest(e: any): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput {
    const req = new HttpRequest(e);
    const res = new HttpResponse();

    const handledRes = this.router.handle(req, res);
    return handledRes.toAppsScriptOutput();
  }
}
