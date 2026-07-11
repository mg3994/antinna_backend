export class RequestQuery {
  constructor(private params: Record<string, string | string[]> = {}) {}

  public get(name: string): string | null {
    const val = this.params[name];
    if (val === undefined || val === null) return null;
    return Array.isArray(val) ? val[0] : val;
  }

  public getArray(name: string): string[] {
    const val = this.params[name];
    if (val === undefined || val === null) return [];
    return Array.isArray(val) ? val : [val];
  }

  public has(name: string): boolean {
    return this.params[name] !== undefined;
  }

  public getAll(): Record<string, string | string[]> {
    return { ...this.params };
  }
}
