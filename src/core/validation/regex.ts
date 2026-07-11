import { ValidationRule } from './rules';

export class RegexRule implements ValidationRule {
  constructor(private pattern: RegExp, public message: string = 'Value does not match required pattern') {}

  public validate(value: any): boolean {
    if (!value) return true;
    return this.pattern.test(String(value));
  }
}
