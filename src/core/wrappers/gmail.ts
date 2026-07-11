export interface IGmailWrapper {
  sendEmail(recipient: string, subject: string, body: string, options?: GoogleAppsScript.Gmail.GmailAdvancedOptions): void;
}

export class AppsScriptGmail implements IGmailWrapper {
  public sendEmail(
    recipient: string,
    subject: string,
    body: string,
    options?: GoogleAppsScript.Gmail.GmailAdvancedOptions
  ): void {
    if (options) {
      GmailApp.sendEmail(recipient, subject, body, options);
    } else {
      GmailApp.sendEmail(recipient, subject, body);
    }
  }
}
