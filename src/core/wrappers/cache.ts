export interface ICache {
  get(key: string): string | null;
  put(key: string, value: string, expirationInSeconds?: number): void;
  remove(key: string): void;
  getOrSet<T>(key: string, factory: () => T, expirationInSeconds?: number): T;
}

export class AppsScriptCache implements ICache {
  private cache: GoogleAppsScript.Cache.Cache;

  constructor(scope: 'script' | 'document' | 'user' = 'script') {
    switch (scope) {
      case 'document':
        this.cache = CacheService.getDocumentCache()!;
        break;
      case 'user':
        this.cache = CacheService.getUserCache()!;
        break;
      case 'script':
      default:
        this.cache = CacheService.getScriptCache()!;
        break;
    }
  }

  public get(key: string): string | null {
    return this.cache.get(key);
  }

  public put(key: string, value: string, expirationInSeconds: number = 600): void {
    // Limit is 6 hours (21600 seconds) in Apps Script
    const safeExp = Math.min(expirationInSeconds, 21600);
    this.cache.put(key, value, safeExp);
  }

  public remove(key: string): void {
    this.cache.remove(key);
  }

  public getOrSet<T>(key: string, factory: () => T, expirationInSeconds: number = 600): T {
    const cached = this.get(key);
    if (cached !== null) {
      try {
        return JSON.parse(cached) as T;
      } catch {
        return cached as unknown as T;
      }
    }
    const val = factory();
    const strVal = typeof val === 'string' ? val : JSON.stringify(val);
    this.put(key, strVal, expirationInSeconds);
    return val;
  }
}
