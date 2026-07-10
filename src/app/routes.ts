import { Router } from '../core/router/router';
import { HttpRequest } from '../core/http/request';
import { HttpResponse } from '../core/http/response';

export function configureRoutes(router: Router): void {
  router.get('/', (req: HttpRequest, res: HttpResponse) => {
    return res.json({
      success: true,
      message: 'Welcome to the Antinna Apps Script Core Framework API!',
      timestamp: new Date().toISOString()
    });
  });

  router.get('/api/health', (req: HttpRequest, res: HttpResponse) => {
    return res.json({
      success: true,
      status: 'healthy',
      uptime: '100%',
      version: '1.0.0'
    });
  });
}
