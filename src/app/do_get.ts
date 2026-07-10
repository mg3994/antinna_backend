import { bootstrap } from './bootstrap';

export function handleGet(e: any): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput {
  const app = bootstrap();
  return app.handleRequest(e);
}
