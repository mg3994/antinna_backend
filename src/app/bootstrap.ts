import { Application } from './app';
import { configureRoutes } from './routes';

export function bootstrap(): Application {
  const app = new Application();

  // Configure standard application routes
  configureRoutes(app.getRouter());

  return app;
}
