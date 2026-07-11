import { Job } from './job';

export class CleanupJob implements Job {
  public name = 'CleanupJob';

  public execute(): void {
    console.log('CleanupJob: Initiating storage cleanup...');
    // Clear old expired caches or logs
    const cache = CacheService.getScriptCache();
    cache?.remove('expired_keys');
    console.log('CleanupJob: Cleanup completed successfully.');
  }
}
