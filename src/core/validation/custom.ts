import { ValidationRule } from './rules';

export class CustomRule<T = any> implements ValidationRule<T> {
  constructor(private fn: (val: T) => boolean, public message: string = 'Value is invalid') {}

  public validate(value: T): boolean {
    return this.fn(value);
  }
}
