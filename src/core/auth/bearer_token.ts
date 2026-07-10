import { HttpRequest } from '../http/request';

export class BearerToken {
  public static extract(req: HttpRequest): string | null {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
    return null;
  }
}
