import { IRangeWrapper } from '../wrappers/sheets';

export class RangeManager {
  constructor(private range: IRangeWrapper) {}

  public getValues(): any[][] {
    return this.range.getValues();
  }

  public setValues(values: any[][]): void {
    this.range.setValues(values);
  }

  public clear(): void {
    this.range.clear();
  }
}
