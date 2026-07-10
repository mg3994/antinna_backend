import { ISheetWrapper } from '../wrappers/sheets';
import { ColumnMap } from './column';
import { DatabaseRow } from './row';
import { Transaction } from './transaction';

export class SheetTable<T extends Record<string, any>> {
  private columnMap: ColumnMap | null = null;

  constructor(private sheet: ISheetWrapper) {}

  private initColumnMap(): ColumnMap {
    if (this.columnMap) return this.columnMap;

    const lastColumn = this.sheet.getLastColumn();
    if (lastColumn === 0) {
      // Empty sheet
      this.columnMap = new ColumnMap([]);
      return this.columnMap;
    }

    const headers = this.sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    this.columnMap = new ColumnMap(headers.map(h => String(h)));
    return this.columnMap;
  }

  public getHeaders(): string[] {
    return this.initColumnMap().getHeaders();
  }

  /**
   * Reads all data rows from the sheet and maps them to standard typed objects.
   */
  public getAll(): DatabaseRow<T>[] {
    const lastRow = this.sheet.getLastRow();
    if (lastRow <= 1) return []; // Only header or empty

    const lastColumn = this.sheet.getLastColumn();
    const values = this.sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
    const map = this.initColumnMap();
    const headers = map.getHeaders();

    return values.map((rowValues, index) => {
      const data: any = {};
      headers.forEach((header, colIdx) => {
        const val = rowValues[colIdx];
        // Parse JSON strings automatically if they look like object or array
        if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
          try {
            data[header] = JSON.parse(val);
          } catch {
            data[header] = val;
          }
        } else {
          data[header] = val;
        }
      });

      return {
        rowNumber: index + 2, // 2-indexed since row 1 is header, row 2 is index 0
        data: data as T
      };
    });
  }

  /**
   * Inserts a record. If the header does not exist, it appends the header first (only in transaction safe mode).
   */
  public insert(record: T): T {
    return Transaction.execute(() => {
      const map = this.initColumnMap();
      let headers = map.getHeaders();

      // If headers are empty, initialize them from record keys
      if (headers.length === 0) {
        headers = Object.keys(record);
        this.sheet.appendRow(headers);
        this.columnMap = new ColumnMap(headers);
      }

      // Prepare row values matching headers
      const rowValues = headers.map(header => {
        const val = record[header];
        if (typeof val === 'object' && val !== null) {
          return JSON.stringify(val);
        }
        return val === undefined ? '' : val;
      });

      this.sheet.appendRow(rowValues);
      return record;
    });
  }

  /**
   * Updates rows that match a predicate.
   */
  public update(predicate: (item: T) => boolean, updater: (item: T) => T): number {
    return Transaction.execute(() => {
      const rows = this.getAll();
      const map = this.initColumnMap();
      const headers = map.getHeaders();
      let updatedCount = 0;

      rows.forEach(row => {
        if (predicate(row.data)) {
          const updatedData = updater(row.data);
          const range = this.sheet.getRange(row.rowNumber, 1, 1, headers.length);

          const rowValues = headers.map(header => {
            const val = updatedData[header];
            if (typeof val === 'object' && val !== null) {
              return JSON.stringify(val);
            }
            return val === undefined ? '' : val;
          });

          range.setValues([rowValues]);
          updatedCount++;
        }
      });

      return updatedCount;
    });
  }

  /**
   * Deletes rows that match a predicate.
   */
  public delete(predicate: (item: T) => boolean): number {
    return Transaction.execute(() => {
      const rows = this.getAll();
      let deletedCount = 0;

      // Iterate in reverse order so row shifts do not affect prior indices
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (predicate(row.data)) {
          this.sheet.deleteRow(row.rowNumber);
          deletedCount++;
        }
      }

      return deletedCount;
    });
  }
}
