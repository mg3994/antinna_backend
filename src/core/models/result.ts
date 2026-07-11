export class Result<T = any, E = any> {
  private constructor(
    private isSuccessVal: boolean,
    private value: T | null,
    private errorVal: E | null
  ) {}

  public static ok<T, E = any>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, null);
  }

  public static fail<T = any, E = any>(error: E): Result<T, E> {
    return new Result<T, E>(false, null, error);
  }

  public isSuccess(): boolean {
    return this.isSuccessVal;
  }

  public isFailure(): boolean {
    return !this.isSuccessVal;
  }

  public getValue(): T {
    if (!this.isSuccessVal) {
      throw new Error('Cannot get value of a failed Result');
    }
    return this.value as T;
  }

  public getError(): E {
    if (this.isSuccessVal) {
      throw new Error('Cannot get error of a successful Result');
    }
    return this.errorVal as E;
  }
}
