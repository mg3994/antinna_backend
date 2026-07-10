export enum CronFrequency {
  MINUTE = 'MINUTE',
  HOUR = 'HOUR',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export class CronSchedule {
  public frequency: CronFrequency = CronFrequency.DAILY;
  public hourValue: number = 0;
  public minuteValue: number = 0;
  public dayValue: number = 1;
  public monthValue: number = 1;
  public dayOfWeekValue?: GoogleAppsScript.Base.Weekday;

  public static everyMinute(): CronSchedule {
    const s = new CronSchedule();
    s.frequency = CronFrequency.MINUTE;
    return s;
  }

  public static dailyAt(hour: number, minute: number = 0): CronSchedule {
    const s = new CronSchedule();
    s.frequency = CronFrequency.DAILY;
    s.hourValue = hour;
    s.minuteValue = minute;
    return s;
  }

  public static weeklyOn(dayOfWeek: GoogleAppsScript.Base.Weekday, hour: number = 0): CronSchedule {
    const s = new CronSchedule();
    s.frequency = CronFrequency.WEEKLY;
    s.dayOfWeekValue = dayOfWeek;
    s.hourValue = hour;
    return s;
  }

  public static monthlyOn(day: number, hour: number = 0): CronSchedule {
    const s = new CronSchedule();
    s.frequency = CronFrequency.MONTHLY;
    s.dayValue = day;
    s.hourValue = hour;
    return s;
  }
}
