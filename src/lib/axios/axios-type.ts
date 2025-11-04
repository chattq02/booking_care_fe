export interface ResponseResult<T = unknown> {
  isSuccess: boolean;
  status: number;
  message: string;
  data: T;
}

export interface PaginationResponse<T> {
  current_page: string;
  data: T;
  next_page_url: string | null;
  path: string;
  per_page: string;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ResponseParamsResult<T = unknown> {
  isSuccess: boolean;
  status: number;
  message: string;
  data: PaginationResponse<T>;
}
