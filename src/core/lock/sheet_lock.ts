import { ILock } from './lock';
import { AppsScriptCache } from '../wrappers/cache';
import { SleepUtils } from '../utils/sleep';

export class SheetLock implements ILock {
  private cache = new AppsScriptCache('script');
  private lockKey: string;
  private isLocked: boolean = false;

  constructor(sheetName: string) {
    this.lockKey = `lock_sheet_${sheetName.toLowerCase().replace(/\s+/g, '_')}`;
  }

  /**
   * Attempts to acquire a sheet-level lock using CacheService polling.
   */
  public tryLock(timeoutMs: number = 10000): boolean {
    const start = Date.now();
    const token = Utilities.getUuid();

    while (Date.now() - start < timeoutMs) {
      // Check if lock already exists
      const existing = this.cache.get(this.lockKey);
      if (existing === null) {
        // Lock is free, attempt to acquire
        // Cache entry expires in 30 seconds automatically if not released (prevents deadlock!)
        this.cache.put(this.lockKey, token, 30);

        // Small delay to ensure no race condition between writes (concurrency double-check)
        SleepUtils.ms(50);

        if (this.cache.get(this.lockKey) === token) {
          this.isLocked = true;
          return true;
        }
      }

      // Poll every 200ms
      SleepUtils.ms(200);
    }

    return false;
  }

  /**
   * Releases the sheet-level lock.
   */
  public releaseLock(): void {
    if (this.isLocked) {
      this.cache.remove(this.lockKey);
      this.isLocked = false;
    }
  }

  public hasLock(): boolean {
    return this.isLocked;
  }
}
