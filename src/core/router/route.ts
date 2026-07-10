import { IRoute, RouteHandler } from './endpoint';

export class Route implements IRoute {
  private pathRegex: RegExp;
  private paramNames: string[] = [];

  constructor(
    public method: string,
    public path: string,
    public handler: RouteHandler
  ) {
    this.pathRegex = this.compilePathPattern();
  }

  private compilePathPattern(): RegExp {
    // Escape special chars except :param
    // E.g. "/api/products/:id" -> RegExp("^/api/products/([^/]+)$")
    const escaped = this.path.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const withParams = escaped.replace(/\\:([a-zA-Z0-9_]+)/g, (_, name) => {
      this.paramNames.push(name);
      return '([^/]+)';
    });
    return new RegExp(`^${withParams}$`, 'i');
  }

  public matches(method: string, path: string): boolean {
    if (this.method.toUpperCase() !== method.toUpperCase()) return false;
    return this.pathRegex.test(path);
  }

  public extractParams(path: string): Record<string, string> {
    const match = path.match(this.pathRegex);
    if (!match) return {};

    const params: Record<string, string> = {};
    const values = match.slice(1);
    this.paramNames.forEach((name, index) => {
      if (values[index] !== undefined) {
        params[name] = decodeURIComponent(values[index]);
      }
    });
    return params;
  }
}
