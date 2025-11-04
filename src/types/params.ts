import type { UserStatus } from "./auth";

export interface IParams {
  page?: number;
  per_page?: number;
  keyword?: string;
  status?: UserStatus;
}
