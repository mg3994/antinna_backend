import { TriggerManager } from './trigger_manager';
import { CronSchedule } from './cron';

export class TriggerScheduler {
  /**
   * Binds a standard Google Apps Script trigger callback to run on a CronSchedule.
   */
  public static schedule(globalCallbackFunction: string, schedule: CronSchedule): void {
    TriggerManager.createTrigger(globalCallbackFunction, schedule);
  }

  /**
   * Unschedules any triggers pointing to the callback.
   */
  public static unschedule(globalCallbackFunction: string): void {
    TriggerManager.deleteTriggers(globalCallbackFunction);
  }
}
