export interface IDocumentWrapper {
  getId(): string;
  getName(): string;
  getBodyText(): string;
  appendParagraph(text: string): void;
}

export class DocumentWrapper implements IDocumentWrapper {
  constructor(private doc: GoogleAppsScript.Document.Document) {}

  public getId(): string {
    return this.doc.getId();
  }

  public getName(): string {
    return this.doc.getName();
  }

  public getBodyText(): string {
    return this.doc.getBody().getText();
  }

  public appendParagraph(text: string): void {
    this.doc.getBody().appendParagraph(text);
  }
}

export class AppsScriptDocumentApp {
  public static openById(id: string): IDocumentWrapper {
    return new DocumentWrapper(DocumentApp.openById(id));
  }

  public static create(name: string): IDocumentWrapper {
    return new DocumentWrapper(DocumentApp.create(name));
  }
}
