import { bootstrap } from './bootstrap';

export function handleDelete(e: any): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput {
  const app = bootstrap();
  return app.handleRequest(e);
}
