import { ValidationRule } from './rules';

export class MinRule implements ValidationRule {
  constructor(private min: number, public message: string = `Value must be at least ${min}`) {}

  public validate(value: any): boolean {
    if (value === undefined || value === null || value === '') return true;
    if (typeof value === 'string') {
      return value.length >= this.min;
    }
    return Number(value) >= this.min;
  }
}
