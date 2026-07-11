import { bootstrap } from './bootstrap';

export function handlePost(e: any): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput {
  const app = bootstrap();
  return app.handleRequest(e);
}
