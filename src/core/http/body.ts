export class RequestBody {
  private parsedJson: any = null;
  private isParsed = false;

  constructor(private rawContent: string = '') {}

  public getRaw(): string {
    return this.rawContent;
  }

  public asJson<T = any>(): T | null {
    if (this.isParsed) return this.parsedJson as T;
    if (!this.rawContent) {
      this.isParsed = true;
      return null;
    }
    try {
      this.parsedJson = JSON.parse(this.rawContent);
    } catch {
      this.parsedJson = null;
    }
    this.isParsed = true;
    return this.parsedJson as T;
  }
}
