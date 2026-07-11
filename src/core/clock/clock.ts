export interface IClock {
  now(): Date;
  timestamp(): number;
  isoString(): string;
}

export class SystemClock implements IClock {
  public now(): Date {
    return new Date();
  }

  public timestamp(): number {
    return Date.now();
  }

  public isoString(): string {
    return new Date().toISOString();
  }
}
