import { HttpRequest } from '../http/request';

export class RequestBuilder {
  private method: string = 'GET';
  private path: string = '/';
  private query: Record<string, string | string[]> = {};
  private headers: Record<string, string> = {};
  private body: string = '';

  public static create(): RequestBuilder {
    return new RequestBuilder();
  }

  public setMethod(method: string): RequestBuilder {
    this.method = method;
    return this;
  }

  public setPath(path: string): RequestBuilder {
    this.path = path;
    return this;
  }

  public setQuery(query: Record<string, string | string[]>): RequestBuilder {
    this.query = query;
    return this;
  }

  public setHeaders(headers: Record<string, string>): RequestBuilder {
    this.headers = headers;
    return this;
  }

  public setBody(body: any): RequestBuilder {
    this.body = typeof body === 'string' ? body : JSON.stringify(body);
    return this;
  }

  public build(): HttpRequest {
    const mockEvent: any = {
      pathInfo: this.path.replace(/^\/+/, ''),
      parameter: {},
      parameters: {},
      headers: this.headers,
      postData: this.body ? { contents: this.body } : undefined
    };

    // Distribute query parameters
    Object.entries(this.query).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        mockEvent.parameters[k] = v;
        mockEvent.parameter[k] = v[0];
      } else {
        mockEvent.parameter[k] = v;
        mockEvent.parameters[k] = [v];
      }
    });

    const req = new HttpRequest(mockEvent);
    req.method = this.method;
    return req;
  }
}
