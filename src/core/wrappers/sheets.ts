export interface IRangeWrapper {
  getValues(): any[][];
  setValues(values: any[][]): void;
  clear(): void;
  getLastRow(): number;
  getLastColumn(): number;
}

export interface ISheetWrapper {
  getName(): string;
  getRange(row: number, column: number, numRows?: number, numColumns?: number): IRangeWrapper;
  getRangeByName(name: string): IRangeWrapper | null;
  getDataRange(): IRangeWrapper;
  appendRow(rowContents: any[]): void;
  getLastRow(): number;
  getLastColumn(): number;
  clear(): void;
  deleteRow(rowPosition: number): void;
}

export interface ISpreadsheetWrapper {
  getSheetByName(name: string): ISheetWrapper | null;
  getSheets(): ISheetWrapper[];
  insertSheet(name: string): ISheetWrapper;
  deleteSheet(sheet: ISheetWrapper): void;
  getId(): string;
  getUrl(): string;
}

export class RangeWrapper implements IRangeWrapper {
  constructor(private range: GoogleAppsScript.Spreadsheet.Range) {}

  public getValues(): any[][] {
    return this.range.getValues();
  }

  public setValues(values: any[][]): void {
    this.range.setValues(values);
  }

  public clear(): void {
    this.range.clear();
  }

  public getLastRow(): number {
    return this.range.getLastRow();
  }

  public getLastColumn(): number {
    return this.range.getLastColumn();
  }
}

export class SheetWrapper implements ISheetWrapper {
  constructor(private sheet: GoogleAppsScript.Spreadsheet.Sheet) {}

  public getName(): string {
    return this.sheet.getName();
  }

  public getRange(row: number, column: number, numRows?: number, numColumns?: number): IRangeWrapper {
    if (numRows !== undefined && numColumns !== undefined) {
      return new RangeWrapper(this.sheet.getRange(row, column, numRows, numColumns));
    }
    if (numRows !== undefined) {
      return new RangeWrapper(this.sheet.getRange(row, column, numRows));
    }
    return new RangeWrapper(this.sheet.getRange(row, column));
  }

  public getRangeByName(name: string): IRangeWrapper | null {
    const range = this.sheet.getRange(name);
    return range ? new RangeWrapper(range) : null;
  }

  public getDataRange(): IRangeWrapper {
    return new RangeWrapper(this.sheet.getDataRange());
  }

  public appendRow(rowContents: any[]): void {
    this.sheet.appendRow(rowContents);
  }

  public getLastRow(): number {
    return this.sheet.getLastRow();
  }

  public getLastColumn(): number {
    return this.sheet.getLastColumn();
  }

  public clear(): void {
    this.sheet.clear();
  }

  public deleteRow(rowPosition: number): void {
    this.sheet.deleteRow(rowPosition);
  }
}

export class SpreadsheetWrapper implements ISpreadsheetWrapper {
  constructor(private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  public getSheetByName(name: string): ISheetWrapper | null {
    const s = this.spreadsheet.getSheetByName(name);
    return s ? new SheetWrapper(s) : null;
  }

  public getSheets(): ISheetWrapper[] {
    return this.spreadsheet.getSheets().map(s => new SheetWrapper(s));
  }

  public insertSheet(name: string): ISheetWrapper {
    return new SheetWrapper(this.spreadsheet.insertSheet(name));
  }

  public deleteSheet(sheet: ISheetWrapper): void {
    // In GAS, deleting a sheet requires a Sheet object. Since SheetWrapper wraps it:
    const gasSheet = this.spreadsheet.getSheetByName(sheet.getName());
    if (gasSheet) {
      this.spreadsheet.deleteSheet(gasSheet);
    }
  }

  public getId(): string {
    return this.spreadsheet.getId();
  }

  public getUrl(): string {
    return this.spreadsheet.getUrl();
  }
}

export class AppsScriptSpreadsheetApp {
  public static openById(id: string): ISpreadsheetWrapper {
    return new SpreadsheetWrapper(SpreadsheetApp.openById(id));
  }

  public static getActiveSpreadsheet(): ISpreadsheetWrapper | null {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    return active ? new SpreadsheetWrapper(active) : null;
  }
}
