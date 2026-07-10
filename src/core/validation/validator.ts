import { ValidationRule } from './rules';
import { RequiredRule } from './required';
import { EmailRule } from './email';
import { RegexRule } from './regex';
import { NumberRule } from './number';
import { MinRule } from './min';
import { MaxRule } from './max';
import { CustomRule } from './custom';

export class Validator {
  private rulesMap: Record<string, ValidationRule[]> = {};
  private errors: Record<string, string[]> = {};

  constructor(private data: Record<string, any> = {}) {}

  public static make(data: Record<string, any> = {}): Validator {
    return new Validator(data);
  }

  public field(name: string): ValidatorFieldBuilder {
    return new ValidatorFieldBuilder(name, this);
  }

  public addRule(field: string, rule: ValidationRule): void {
    if (!this.rulesMap[field]) {
      this.rulesMap[field] = [];
    }
    this.rulesMap[field].push(rule);
  }

  public validate(): boolean {
    this.errors = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(this.rulesMap)) {
      const val = this.data[field];
      for (const rule of rules) {
        if (!rule.validate(val)) {
          if (!this.errors[field]) {
            this.errors[field] = [];
          }
          this.errors[field].push(rule.message);
          isValid = false;
        }
      }
    }

    return isValid;
  }

  public getErrors(): Record<string, string[]> {
    return { ...this.errors };
  }
}

export class ValidatorFieldBuilder {
  constructor(private fieldName: string, private validator: Validator) {}

  public required(message?: string): ValidatorFieldBuilder {
    this.validator.addRule(this.fieldName, new RequiredRule(message));
    return this;
  }

  public email(message?: string): ValidatorFieldBuilder {
    this.validator.addRule(this.fieldName, new EmailRule(message));
    return this;
  }

  public regex(pattern: RegExp, message?: string): ValidatorFieldBuilder {
    this.validator.addRule(this.fieldName, new RegexRule(pattern, message));
    return this;
  }

  public number(message?: string): ValidatorFieldBuilder {
    this.validator.addRule(this.fieldName, new NumberRule(message));
    return this;
  }

  public min(limit: number, message?: string): ValidatorFieldBuilder {
    this.validator.addRule(this.fieldName, new MinRule(limit, message));
    return this;
  }

  public max(limit: number, message?: string): ValidatorFieldBuilder {
    this.validator.addRule(this.fieldName, new MaxRule(limit, message));
    return this;
  }

  public custom(fn: (val: any) => boolean, message?: string): ValidatorFieldBuilder {
    this.validator.addRule(this.fieldName, new CustomRule(fn, message));
    return this;
  }
}
