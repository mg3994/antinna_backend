import { RequestHeaders } from './headers';
import { RequestQuery } from './query';
import { RequestParams } from './params';
import { RequestBody } from './body';

export class HttpRequest {
  public method: string;
  public path: string;
  public headers: RequestHeaders;
  public query: RequestQuery;
  public params: RequestParams = new RequestParams({});
  public body: RequestBody;

  constructor(e: any) {
    // 1. Headers (GAS does not give direct headers, but let's parse if they're embedded or mock them)
    const rawHeaders: Record<string, string> = {};
    if (e.headers) {
      Object.entries(e.headers).forEach(([k, v]) => {
        rawHeaders[k] = String(v);
      });
    }
    this.headers = new RequestHeaders(rawHeaders);

    // 2. Query Parameters
    const rawQuery: Record<string, string | string[]> = {};
    if (e.parameter) {
      Object.entries(e.parameter).forEach(([k, v]) => {
        rawQuery[k] = v as string;
      });
    }
    if (e.parameters) {
      Object.entries(e.parameters).forEach(([k, v]) => {
        rawQuery[k] = v as string[];
      });
    }
    this.query = new RequestQuery(rawQuery);

    // 3. Extract Path from e.pathInfo, or query parameter 'path', defaulting to "/"
    let extractedPath = '/';
    if (e.pathInfo) {
      extractedPath = '/' + e.pathInfo;
    } else if (e.parameter && e.parameter.path) {
      extractedPath = e.parameter.path;
    } else if (e.parameter && e.parameter.route) {
      extractedPath = e.parameter.route;
    }
    // Standardize path: remove trailing slash, ensure starting slash
    this.path = '/' + extractedPath.replace(/^\/+|\/+$/g, '');

    // 4. Method (supporting method override tunneling via _method parameter or X-HTTP-Method-Override header)
    let rawMethod = 'GET';
    if (e.postData) {
      rawMethod = 'POST';
    }

    const methodOverride = this.query.get('_method') || this.headers.get('x-http-method-override');
    if (methodOverride) {
      this.method = methodOverride.toUpperCase();
    } else {
      this.method = rawMethod;
    }

    // 5. Body
    const rawBody = e.postData && e.postData.contents ? e.postData.contents : '';
    this.body = new RequestBody(rawBody);
  }

  public setParams(params: Record<string, string>): void {
    this.params = new RequestParams(params);
  }
}
