/**
 * Method decorator that wraps execution inside an exclusive Script Lock.
 */
export function locked(timeoutMs: number = 10000) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const lock = LockService.getScriptLock();
      const locked = lock.tryLock(timeoutMs);
      if (!locked) {
        throw new Error('Lock acquisition timeout. Resource is currently locked by another process.');
      }
      try {
        return originalMethod.apply(this, args);
      } finally {
        lock.releaseLock();
      }
    };

    return descriptor;
  };
}
