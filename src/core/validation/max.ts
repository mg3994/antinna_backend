import { ValidationRule } from './rules';

export class MaxRule implements ValidationRule {
  constructor(private max: number, public message: string = `Value must be at most ${max}`) {}

  public validate(value: any): boolean {
    if (value === undefined || value === null || value === '') return true;
    if (typeof value === 'string') {
      return value.length <= this.max;
    }
    return Number(value) <= this.max;
  }
}
