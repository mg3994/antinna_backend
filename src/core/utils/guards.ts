export class TypeGuards {
  public static isString(val: any): val is string {
    return typeof val === 'string';
  }

  public static isNumber(val: any): val is number {
    return typeof val === 'number' && !isNaN(val);
  }

  public static isArray(val: any): val is any[] {
    return Array.isArray(val);
  }

  public static isObject(val: any): val is Record<string, any> {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
  }
}
