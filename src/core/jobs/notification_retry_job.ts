import { Job } from './job';

export class NotificationRetryJob implements Job {
  public name = 'NotificationRetryJob';

  public execute(): void {
    console.log('NotificationRetryJob: Retrying failed notifications...');
    // Locate failures and retry sending them
  }
}
