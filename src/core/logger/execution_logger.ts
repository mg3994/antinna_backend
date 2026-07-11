import { ILogger } from './logger';

export class ExecutionLogger implements ILogger {
  constructor(private loggers: ILogger[]) {}

  public debug(message: string, context?: any): void {
    this.loggers.forEach(l => l.debug(message, context));
  }

  public info(message: string, context?: any): void {
    this.loggers.forEach(l => l.info(message, context));
  }

  public warn(message: string, context?: any): void {
    this.loggers.forEach(l => l.warn(message, context));
  }

  public error(message: string, context?: any): void {
    this.loggers.forEach(l => l.error(message, context));
  }
}
