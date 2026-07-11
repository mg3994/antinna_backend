import { AppsScriptCache } from '../wrappers/cache';

/**
 * Method decorator that caches method outputs based on arguments.
 */
export function cached(ttlSeconds: number = 600) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cache = new AppsScriptCache('script');

    descriptor.value = function (...args: any[]) {
      const key = `${target.constructor.name}_${propertyKey}_${JSON.stringify(args)}`;
      const cachedVal = cache.get(key);
      if (cachedVal !== null) {
        try {
          return JSON.parse(cachedVal);
        } catch {
          return cachedVal;
        }
      }

      const result = originalMethod.apply(this, args);
      const strVal = typeof result === 'string' ? result : JSON.stringify(result);
      cache.put(key, strVal, ttlSeconds);
      return result;
    };

    return descriptor;
  };
}
