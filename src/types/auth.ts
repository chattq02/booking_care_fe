import type { IFacility } from "@/lib/axios/axios-type";

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
}

export type UserRole = {
  role: "ADMIN" | "USER" | "DOCTOR";
  facility: IFacility;
};
export type UserStatus = "Active" | "InActive" | "Pending" | "Banned" | "All";

export interface GetMeResponseData {
  id: number;
  uuid: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  is_supper_admin: "NO" | "YES";
  cccd: string;
  bhyt: string;
  occupation: string;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
  is_selected?: boolean;
  is_update_profile: "NO" | "YES";
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface ReqUpdateUser {
  fullName: string;
  gender: string;
  phone: string;
  birthday: string;
  cccd: string;
  healthInsurance: string;
  occupation: string;
  address: string;
}
