export class NumberUtils {
  public static toSafeNumber(val: any, fallback = 0): number {
    if (val === undefined || val === null) return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  }

  public static isBetween(val: number, min: number | null, max: number | null): boolean {
    if (min !== null && val < min) return false;
    if (max !== null && val > max) return false;
    return true;
  }
}
