export class ArrayUtils {
  public static getFirst<T>(val: T | T[] | undefined | null): T | null {
    if (val === undefined || val === null) return null;
    if (Array.isArray(val)) return val[0] !== undefined ? val[0] : null;
    return val;
  }

  public static getArray<T>(val: T | T[] | undefined | null): T[] {
    if (val === undefined || val === null) return [];
    if (Array.isArray(val)) return val;
    return [val];
  }

  public static deduplicate<T>(array: T[], keyExtractor?: (item: T) => any): T[] {
    if (!keyExtractor) {
      return Array.from(new Set(array));
    }
    const seen = new Set();
    return array.filter(item => {
      const key = keyExtractor(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
