export interface IBlob {
  getBytes(): number[];
  getDataAsString(): string;
  getContentType(): string;
  getName(): string;
}

export class AppsScriptBlob implements IBlob {
  constructor(private blob: GoogleAppsScript.Base.Blob) {}

  public getBytes(): number[] {
    return this.blob.getBytes();
  }

  public getDataAsString(): string {
    return this.blob.getDataAsString();
  }

  public getContentType(): string {
    return this.blob.getContentType()!;
  }

  public getName(): string {
    return this.blob.getName()!;
  }
}
