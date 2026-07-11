export interface DatabaseRow<T = any> {
  rowNumber: number;
  data: T;
}
