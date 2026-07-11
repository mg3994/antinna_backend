import { HttpRequest } from '../http/request';

export class ApiKey {
  public static extract(req: HttpRequest): string | null {
    return req.headers.get('X-API-Key') || req.query.get('apiKey');
  }

  public static validate(req: HttpRequest, expectedKey: string): boolean {
    const key = this.extract(req);
    return key !== null && key === expectedKey;
  }
}
