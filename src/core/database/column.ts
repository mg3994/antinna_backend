export class ColumnMap {
  private headers: string[] = [];

  constructor(headers: string[]) {
    this.headers = headers.map(h => h.trim());
  }

  public getIndex(name: string): number {
    const idx = this.headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
    return idx === -1 ? -1 : idx + 1; // 1-indexed for sheets
  }

  public getName(index: number): string | null {
    const header = this.headers[index - 1];
    return header || null;
  }

  public getHeaders(): string[] {
    return [...this.headers];
  }
}
