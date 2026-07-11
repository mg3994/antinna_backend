import { ILock } from './lock';

export class DocumentLock implements ILock {
  private lock: GoogleAppsScript.Lock.Lock;
  private isLocked: boolean = false;

  constructor() {
    this.lock = LockService.getDocumentLock()!;
  }

  public tryLock(timeoutMs: number): boolean {
    this.isLocked = this.lock.tryLock(timeoutMs);
    return this.isLocked;
  }

  public releaseLock(): void {
    if (this.isLocked) {
      this.lock.releaseLock();
      this.isLocked = false;
    }
  }

  public hasLock(): boolean {
    return this.isLocked;
  }
}
