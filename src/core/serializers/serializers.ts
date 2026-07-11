export interface ISerializer {
  serialize(data: any): string;
  deserialize<T>(raw: string): T;
}

export class JsonSerializer implements ISerializer {
  public serialize(data: any): string {
    return JSON.stringify(data);
  }

  public deserialize<T>(raw: string): T {
    return JSON.parse(raw) as T;
  }
}
