import { ILogger, LogLevel } from './logger';
import { SpreadsheetDatabase } from '../database/spreadsheet';
import { SheetTable } from '../database/sheet';

interface LogRecord {
  timestamp: string;
  level: string;
  message: string;
  context: string;
}

export class SheetLogger implements ILogger {
  private logTable: SheetTable<LogRecord>;

  constructor(db: SpreadsheetDatabase, tabName: string = 'Logs') {
    this.logTable = db.getTable<LogRecord>(tabName);
  }

  private log(level: LogLevel, message: string, context?: any): void {
    const timestamp = new Date().toISOString();
    this.logTable.insert({
      timestamp,
      level,
      message,
      context: context ? JSON.stringify(context) : ''
    });
  }

  public debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  public info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context);
  }

  public warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context);
  }

  public error(message: string, context?: any): void {
    this.log(LogLevel.ERROR, message, context);
  }
}
