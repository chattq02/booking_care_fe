export interface ResponseResult<T = unknown> {
  isSuccess: boolean;
  status: number;
  message: string;
  data: T;
}
