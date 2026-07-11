import { AppsScriptCache, ICache } from '../wrappers/cache';
import { CacheScope } from './cache_scope';

export class CacheService {
  private cache: ICache;

  constructor(scope: CacheScope = CacheScope.SCRIPT) {
    const scopeStr = scope.toLowerCase() as 'script' | 'document' | 'user';
    this.cache = new AppsScriptCache(scopeStr);
  }

  public get(key: string): string | null {
    return this.cache.get(key);
  }

  public put(key: string, value: string, expirationInSeconds?: number): void {
    this.cache.put(key, value, expirationInSeconds);
  }

  public remove(key: string): void {
    this.cache.remove(key);
  }

  public getOrSet<T>(key: string, factory: () => T, expirationInSeconds?: number): T {
    return this.cache.getOrSet(key, factory, expirationInSeconds);
  }
}
