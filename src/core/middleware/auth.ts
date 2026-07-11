import { HttpRequest } from '../http/request';
import { HttpResponse } from '../http/response';
import { Middleware } from '../router/router';
import { AuthGuard } from '../auth/auth_guard';
import { StatusCode } from '../constants/status_code';

export function createAuthMiddleware(firebaseProjectId?: string): Middleware {
  const guard = new AuthGuard(firebaseProjectId);

  return (req: HttpRequest, res: HttpResponse, next: () => void): void => {
    const isAuthenticated = guard.authenticate(req);
    if (!isAuthenticated) {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        status: StatusCode.UNAUTHORIZED,
        message: 'Unauthorized access. Valid Firebase ID Token is required.',
        error: 'UNAUTHORIZED'
      });
      return;
    }
    next();
  };
}
