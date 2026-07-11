import { ISheetWrapper } from '../wrappers/sheets';

export class BatchDelete {
  constructor(private sheet: ISheetWrapper) {}

  /**
   * Deletes all rows except the header row in a single sheet-clear operation.
   */
  public deleteAllData(): void {
    const lastRow = this.sheet.getLastRow();
    if (lastRow <= 1) return;
    const lastCol = this.sheet.getLastColumn();
    this.sheet.getRange(2, 1, lastRow - 1, lastCol).clear();
  }

  /**
   * Deletes multiple rows matching a predicate in a single rewrite batch operation.
   */
  public deleteMatching(predicate: (rowValues: any[], rowIndex: number) => boolean): void {
    const lastRow = this.sheet.getLastRow();
    if (lastRow === 0) return;

    const lastCol = this.sheet.getLastColumn();
    if (lastCol === 0) return;

    const range = this.sheet.getRange(1, 1, lastRow, lastCol);
    const values = range.getValues();

    const header = values[0];
    const filteredRows = [header];

    for (let i = 1; i < values.length; i++) {
      if (!predicate(values[i], i)) {
        filteredRows.push(values[i]);
      }
    }

    // Clear entire sheet first and write back filtered data
    this.sheet.clear();
    const newRange = this.sheet.getRange(1, 1, filteredRows.length, lastCol);
    newRange.setValues(filteredRows);
  }
}
