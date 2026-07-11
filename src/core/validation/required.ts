import { ValidationRule } from './rules';

export class RequiredRule implements ValidationRule {
  constructor(public message: string = 'This field is required') {}

  public validate(value: any): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  }
}
