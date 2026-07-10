export class Transaction {
  /**
   * Executes a block of database operations with an exclusive lock.
   */
  public static execute<T>(block: () => T, timeoutMs: number = 10000): T {
    const lock = LockService.getScriptLock();
    const locked = lock.tryLock(timeoutMs);

    if (!locked) {
      throw new Error('Database transaction lock timeout. Another process is currently writing to the database.');
    }

    try {
      const result = block();
      SpreadsheetApp.flush(); // Commit all sheet changes
      return result;
    } finally {
      lock.releaseLock();
    }
  }
}
