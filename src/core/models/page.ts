import { PaginationModel } from './pagination';

export interface PageModel<T> {
  data: T[];
  pagination: PaginationModel;
}
