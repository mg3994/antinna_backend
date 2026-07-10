import { ValidationRule } from './rules';

export class EmailRule implements ValidationRule {
  constructor(public message: string = 'Invalid email address') {}

  public validate(value: any): boolean {
    if (!value) return true; // Let required rule handle empty value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(value));
  }
}
