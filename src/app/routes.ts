import { Router } from '../core/router/router';
import { HttpRequest } from '../core/http/request';
import { HttpResponse } from '../core/http/response';
import { CheckoutFeature } from '../features/checkout';
import { BloggerCmsFeature } from '../features/blogger_cms';
import { execute } from '../core/handler/execute';

export function configureRoutes(router: Router): void {
  const checkoutFeature = new CheckoutFeature();
  const bloggerCms = new BloggerCmsFeature();

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

  // Mapped E-Commerce Features
  router.post('/api/checkout', execute((req: HttpRequest, res: HttpResponse) => {
    return checkoutFeature.handleCheckout(req, res);
  }));

  router.post('/api/sync-blog', execute((req: HttpRequest, res: HttpResponse) => {
    const updated = bloggerCms.syncBlogPosts();
    return res.json({
      success: true,
      message: 'Blogger platform synchronicity completed successfully!',
      postsSynchronized: updated
    });
  }));
}
