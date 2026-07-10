export interface ICalendarWrapper {
  createEvent(title: string, startTime: Date, endTime: Date, options?: Record<string, any>): any;
  getEvents(startTime: Date, endTime: Date): any[];
}

export class AppsScriptCalendar implements ICalendarWrapper {
  public createEvent(title: string, startTime: Date, endTime: Date, options?: Record<string, any>): any {
    if (options) {
      return CalendarApp.createEvent(title, startTime, endTime, options);
    }
    return CalendarApp.createEvent(title, startTime, endTime);
  }

  public getEvents(startTime: Date, endTime: Date): any[] {
    return CalendarApp.getEvents(startTime, endTime);
  }
}
