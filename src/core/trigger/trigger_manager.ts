import { CronSchedule, CronFrequency } from './cron';

export class TriggerManager {
  /**
   * Deletes any existing triggers pointing to the specified callback function.
   */
  public static deleteTriggers(callbackFunction: string): void {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === callbackFunction) {
        ScriptApp.deleteTrigger(trigger);
      }
    });
  }

  /**
   * Creates a ScriptApp trigger for a callback function based on a CronSchedule.
   */
  public static createTrigger(callbackFunction: string, schedule: CronSchedule): void {
    // Delete existing triggers first to avoid duplication
    this.deleteTriggers(callbackFunction);

    let builder = ScriptApp.newTrigger(callbackFunction).timeBased();

    switch (schedule.frequency) {
      case CronFrequency.MINUTE:
        builder = builder.everyMinutes(1);
        break;
      case CronFrequency.HOUR:
        builder = builder.everyHours(1);
        break;
      case CronFrequency.DAILY:
        builder = builder.everyDays(1).atHour(schedule.hourValue);
        break;
      case CronFrequency.WEEKLY:
        if (schedule.dayOfWeekValue) {
          builder = builder.onWeekDay(schedule.dayOfWeekValue).atHour(schedule.hourValue);
        } else {
          builder = builder.everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(schedule.hourValue);
        }
        break;
      case CronFrequency.MONTHLY:
        builder = builder.onMonthDay(schedule.dayValue).atHour(schedule.hourValue);
        break;
      default:
        builder = builder.everyDays(1).atHour(0);
        break;
    }

    builder.create();
  }
}
