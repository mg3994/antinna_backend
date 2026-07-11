export class DateUtils {
  public static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  public static isExpired(expirationDate: Date): boolean {
    return Date.now() > expirationDate.getTime();
  }

  public static formatISO(date: Date): string {
    return date.toISOString();
  }
}
