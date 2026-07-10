export class RequestParams {
  constructor(private params: Record<string, string> = {}) {}

  public get(name: string): string | null {
    return this.params[name] || null;
  }

  public has(name: string): boolean {
    return this.params[name] !== undefined;
  }

  public getAll(): Record<string, string> {
    return { ...this.params };
  }
}
