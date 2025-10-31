export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
}

export type UserRole = "ADMIN" | "USER" | "DOCTOR";

export interface GetMeResponseData {
  id: number;
  uuid: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  is_supper_admin: "NO";
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}
