import { ISheetWrapper } from '../wrappers/sheets';

export class BatchReader {
  constructor(private sheet: ISheetWrapper) {}

  /**
   * Reads all cell values in a single continuous block.
   */
  public readAll(): any[][] {
    return this.sheet.getDataRange().getValues();
  }

  /**
   * Reads a specific block of rows and columns.
   */
  public readBlock(startRow: number, startCol: number, numRows: number, numCols: number): any[][] {
    return this.sheet.getRange(startRow, startCol, numRows, numCols).getValues();
  }
}
