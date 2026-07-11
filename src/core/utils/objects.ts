export class ObjectUtils {
  public static clone<T>(obj: T): T {
    if (obj === undefined || obj === null) return obj;
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  public static isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  public static merge(target: any, source: any): any {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.merge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }
}
