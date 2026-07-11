export interface ILock {
  tryLock(timeoutMs: number): boolean;
  releaseLock(): void;
  hasLock(): boolean;
}
