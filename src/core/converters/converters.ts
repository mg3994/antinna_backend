export class TypeConverter {
  public static toString(val: any): string {
    if (val === undefined || val === null) return '';
    return String(val);
  }

  public static toNumber(val: any, fallback = 0): number {
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  }

  public static toBoolean(val: any): boolean {
    if (typeof val === 'boolean') return val;
    const str = String(val).toLowerCase();
    return str === 'true' || str === '1' || str === 'yes';
  }

  public static toDate(val: any): Date | null {
    if (!val) return null;
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date;
  }
}
