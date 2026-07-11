export interface IFactory<T> {
  create(...args: any[]): T;
}

export class SimpleFactory<T> implements IFactory<T> {
  constructor(private ctor: new (...args: any[]) => T) {}

  public create(...args: any[]): T {
    return new this.ctor(...args);
  }
}
