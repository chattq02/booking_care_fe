import type { UserStatus } from "@/types/auth";

export interface ResponseDoctor {
  id: number;
  uuid: string;
  email: string;
  fullName: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  createdAt: string; // ISO date string
  avatar: string | null;
  user_status: UserStatus; // tuỳ hệ thống của bạn
  cccd: string | null;
  is_verify: "YES" | "NO";
  is_update_profile: "YES" | "NO";
  academicTitle: {
    id: number;
    name: string;
    description: string;
  };
  departments: {
    id: number;
    name: string;
  }[];
  facilities: {
    id: number;
    name: string;
  }[];
  description?: string;
}
