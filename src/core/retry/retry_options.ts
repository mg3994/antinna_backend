export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  onRetry?: (error: any, attempt: number) => void;
  retryOnlyOn?: any[]; // Exceptions to retry on
}
