import { Job } from './job';

export class BloggerSyncJob implements Job {
  public name = 'BloggerSyncJob';

  public execute(): void {
    console.log('BloggerSyncJob: Synchronizing Blogger platform posts...');
  }
}
