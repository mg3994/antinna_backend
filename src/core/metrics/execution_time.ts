import { Stopwatch } from './stopwatch';

export class ExecutionTime {
  public static measure<T>(operationName: string, fn: () => T, logger?: (msg: string) => void): T {
    const sw = new Stopwatch();
    sw.start();
    try {
      return fn();
    } finally {
      const duration = sw.stop();
      const msg = `Operation [${operationName}] took ${duration} ms.`;
      if (logger) {
        logger(msg);
      } else {
        console.log(msg);
      }
    }
  }

  public static async measureAsync<T>(operationName: string, fn: () => Promise<T>, logger?: (msg: string) => void): Promise<T> {
    const sw = new Stopwatch();
    sw.start();
    try {
      return await fn();
    } finally {
      const duration = sw.stop();
      const msg = `Operation [${operationName}] took ${duration} ms.`;
      if (logger) {
        logger(msg);
      } else {
        console.log(msg);
      }
    }
  }
}
