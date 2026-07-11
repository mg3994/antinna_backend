import { ExecutionTime } from '../metrics/execution_time';

/**
 * Method decorator that profiles method execution time.
 */
export function timed(label?: string) {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const name = label || propertyKey;

    descriptor.value = function (...args: any[]) {
      return ExecutionTime.measure(name, () => {
        return originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
