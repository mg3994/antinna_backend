export interface ValidationRule<T = any> {
  validate(value: T): boolean;
  message: string;
}
