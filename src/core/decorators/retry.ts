import { SleepUtils } from '../utils/sleep';

/**
 * Method decorator that retries execution on exception.
 */
export function retry(retries: number = 3, delayMs: number = 1000) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      let attempts = 0;
      while (attempts < retries) {
        try {
          return originalMethod.apply(this, args);
        } catch (err) {
          attempts++;
          if (attempts >= retries) {
            throw err;
          }
          SleepUtils.ms(delayMs * Math.pow(2, attempts - 1)); // Exponential backoff
        }
      }
    };

    return descriptor;
  };
}
