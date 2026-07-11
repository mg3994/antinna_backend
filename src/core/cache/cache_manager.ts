import { CacheService } from './cache_service';
import { CacheScope } from './cache_scope';

export class CacheManager {
  private services: Map<CacheScope, CacheService> = new Map();

  public getCache(scope: CacheScope = CacheScope.SCRIPT): CacheService {
    if (!this.services.has(scope)) {
      this.services.set(scope, new CacheService(scope));
    }
    return this.services.get(scope)!;
  }
}
