import { ISheetWrapper } from '../wrappers/sheets';

export class BatchWriter {
  constructor(private sheet: ISheetWrapper) {}

  /**
   * Overwrites or writes a block of values at the specified row and column in a single API call.
   */
  public writeBlock(startRow: number, startCol: number, values: any[][]): void {
    if (values.length === 0 || values[0].length === 0) return;
    const range = this.sheet.getRange(startRow, startCol, values.length, values[0].length);
    range.setValues(values);
  }
}
