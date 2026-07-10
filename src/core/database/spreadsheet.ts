import { AppsScriptSpreadsheetApp, ISpreadsheetWrapper } from '../wrappers/sheets';
import { SheetTable } from './sheet';

export class SpreadsheetDatabase {
  private spreadsheet: ISpreadsheetWrapper;

  constructor(spreadsheetId?: string) {
    let resolved: ISpreadsheetWrapper | null = null;
    if (spreadsheetId) {
      resolved = AppsScriptSpreadsheetApp.openById(spreadsheetId);
    } else {
      resolved = AppsScriptSpreadsheetApp.getActiveSpreadsheet();
    }

    if (!resolved) {
      throw new Error('Could not open active spreadsheet or resolve spreadsheet ID. Ensure script is bound to a spreadsheet or ID is correct.');
    }
    this.spreadsheet = resolved;
  }

  public getTable<T extends Record<string, any>>(tableName: string): SheetTable<T> {
    let sheet = this.spreadsheet.getSheetByName(tableName);
    if (!sheet) {
      sheet = this.spreadsheet.insertSheet(tableName);
    }
    return new SheetTable<T>(sheet);
  }
}
