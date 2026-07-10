export class RequestHeaders {
  private headers: Map<string, string> = new Map();

  constructor(initialHeaders?: Record<string, string>) {
    if (initialHeaders) {
      for (const [key, value] of Object.entries(initialHeaders)) {
        this.headers.set(key.toLowerCase(), value);
      }
    }
  }

  public get(name: string): string | null {
    return this.headers.get(name.toLowerCase()) || null;
  }

  public has(name: string): boolean {
    return this.headers.has(name.toLowerCase());
  }

  public set(name: string, value: string): void {
    this.headers.set(name.toLowerCase(), value);
  }

  public getAll(): Record<string, string> {
    const obj: Record<string, string> = {};
    this.headers.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
}
