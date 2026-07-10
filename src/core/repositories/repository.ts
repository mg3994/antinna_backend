import { SpreadsheetDatabase } from '../database/spreadsheet';
import { SheetTable } from '../database/sheet';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IRepository<T extends Record<string, any>> {
  create(item: T): T;
  findById(id: string, idField?: keyof T): T | null;
  findAll(filter?: (item: T) => boolean, pagination?: PaginationOptions): PaginatedResult<T> | T[];
  update(id: string, item: Partial<T>, idField?: keyof T): boolean;
  delete(id: string, idField?: keyof T): boolean;
}

export class SpreadsheetRepository<T extends Record<string, any>> implements IRepository<T> {
  protected table: SheetTable<T>;

  constructor(db: SpreadsheetDatabase, tableName: string) {
    this.table = db.getTable<T>(tableName);
  }

  public create(item: T): T {
    return this.table.insert(item);
  }

  public findById(id: string, idField: keyof T = 'id'): T | null {
    const rows = this.table.getAll();
    const found = rows.find(row => String(row.data[idField]) === id);
    return found ? found.data : null;
  }

  public findAll(
    filter?: (item: T) => boolean,
    pagination?: PaginationOptions
  ): PaginatedResult<T> | T[] {
    const rows = this.table.getAll().map(row => row.data);
    let filtered = filter ? rows.filter(filter) : rows;

    if (!pagination) {
      return filtered;
    }

    const { page, limit } = pagination;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filtered.length / limit);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
      totalPages
    };
  }

  public update(id: string, item: Partial<T>, idField: keyof T = 'id'): boolean {
    const count = this.table.update(
      data => String(data[idField]) === id,
      data => ({ ...data, ...item } as T)
    );
    return count > 0;
  }

  public delete(id: string, idField: keyof T = 'id'): boolean {
    const count = this.table.delete(
      data => String(data[idField]) === id
    );
    return count > 0;
  }
}
