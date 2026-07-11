import { ISheetWrapper } from '../wrappers/sheets';

export class BatchUpdate {
  constructor(private sheet: ISheetWrapper) {}

  /**
   * Applies an updater function to all row values, and saves the updated values block in one single call.
   */
  public updateAll(updater: (rowValues: any[], rowIndex: number) => any[]): void {
    const lastRow = this.sheet.getLastRow();
    if (lastRow === 0) return;

    const lastCol = this.sheet.getLastColumn();
    if (lastCol === 0) return;

    const range = this.sheet.getRange(1, 1, lastRow, lastCol);
    const values = range.getValues();

    const updatedValues = values.map((row, index) => {
      if (index === 0) return row; // Preserve header row
      return updater(row, index);
    });

    range.setValues(updatedValues);
  }
}
