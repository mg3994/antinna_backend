export interface ApiErrorModel {
  success: boolean;
  status: number;
  message: string;
  error: string;
  validationErrors?: Record<string, string[]>;
}
