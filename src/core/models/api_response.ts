import { PaginationMeta } from '../builders/pagination_builder';

export interface ApiResponseModel<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  metadata?: Record<string, any>;
  pagination?: PaginationMeta;
}
