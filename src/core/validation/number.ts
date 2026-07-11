import { ValidationRule } from './rules';

export class NumberRule implements ValidationRule {
  constructor(public message: string = 'Value must be a valid number') {}

  public validate(value: any): boolean {
    if (value === undefined || value === null || value === '') return true;
    const num = Number(value);
    return !isNaN(num);
  }
}
