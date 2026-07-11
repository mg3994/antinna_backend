export class ExponentialBackoff {
  public static calculateDelay(attempt: number, initialDelayMs: number = 1000, backoffFactor: number = 2): number {
    return initialDelayMs * Math.pow(backoffFactor, attempt - 1);
  }
}
