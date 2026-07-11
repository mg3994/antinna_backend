import { RetryOptions } from './retry_options';
import { ExponentialBackoff } from './exponential_backoff';
import { SleepUtils } from '../utils/sleep';

export class RetryHelper {
  /**
   * Executes an operation synchronously and retries on failure with exponential backoff.
   */
  public static execute<T>(operation: () => T, options: RetryOptions = {}): T {
    const maxRetries = options.maxRetries ?? 3;
    const initialDelayMs = options.initialDelayMs ?? 1000;
    const backoffFactor = options.backoffFactor ?? 2;
    const retryOnlyOn = options.retryOnlyOn ?? [];

    let attempt = 0;

    while (true) {
      try {
        return operation();
      } catch (err: any) {
        attempt++;
        if (attempt >= maxRetries) {
          throw err;
        }

        // Check if we should only retry on specific exception types
        if (retryOnlyOn.length > 0) {
          const matches = retryOnlyOn.some(excClass => err instanceof excClass);
          if (!matches) {
            throw err;
          }
        }

        if (options.onRetry) {
          options.onRetry(err, attempt);
        }

        const delay = ExponentialBackoff.calculateDelay(attempt, initialDelayMs, backoffFactor);
        SleepUtils.ms(delay);
      }
    }
  }
}
