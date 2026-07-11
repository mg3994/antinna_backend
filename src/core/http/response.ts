import { StatusCode } from '../constants/status_code';
import { MimeType } from '../constants/mime_type';

export class HttpResponse {
  private statusCode: number = StatusCode.OK;
  private headers: Record<string, string> = {};
  private body: any = null;
  private mimeType: string = MimeType.JSON;

  public status(code: number): HttpResponse {
    this.statusCode = code;
    return this;
  }

  public header(name: string, value: string): HttpResponse {
    this.headers[name] = value;
    return this;
  }

  public getHeader(name: string): string | null {
    return this.headers[name] || null;
  }

  public getStatus(): number {
    return this.statusCode;
  }

  public getBody(): any {
    return this.body;
  }

  public getMimeType(): string {
    return this.mimeType;
  }

  public json(data: any): HttpResponse {
    this.body = data;
    this.mimeType = MimeType.JSON;
    return this;
  }

  public jsonLd(data: any): HttpResponse {
    this.body = data;
    this.mimeType = MimeType.JSON_LD;
    this.header('Content-Type', MimeType.JSON_LD);
    return this;
  }

  public html(htmlString: string): HttpResponse {
    this.body = htmlString;
    this.mimeType = MimeType.HTML;
    return this;
  }

  public text(textString: string): HttpResponse {
    this.body = textString;
    this.mimeType = MimeType.TEXT;
    return this;
  }

  /**
   * Converts the response to a native Google Apps Script output object.
   */
  public toAppsScriptOutput(): GoogleAppsScript.Content.TextOutput | GoogleAppsScript.HTML.HtmlOutput {
    if (this.mimeType === MimeType.HTML) {
      return HtmlService.createHtmlOutput(this.body);
    }

    // Default to JSON/Text Output
    const serializedBody = typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
    const textOutput = ContentService.createTextOutput(serializedBody);

    if (this.mimeType === MimeType.JSON || this.mimeType === MimeType.JSON_LD) {
      textOutput.setMimeType(ContentService.MimeType.JSON);
    } else {
      textOutput.setMimeType(ContentService.MimeType.TEXT);
    }

    return textOutput;
  }
}
