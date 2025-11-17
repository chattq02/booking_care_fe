import type { IParams } from "@/types/params";

export interface ResponseDepartment {
  id?: number; // Mã phòng ban
  name: string; // Tên phòng ban
  description?: string | null; // Mô tả
  parentId?: number | null; // ID phòng ban cha

  parent?: ResponseDepartment | null; // Đối tượng cha
  children?: ResponseDepartment[]; // Danh sách phòng ban con
  imageUrl?: string | null; // Đường dẫn hình ảnh
  createdAt?: Date; // Ngày tạo
  updatedAt?: Date; // Ngày cập nhật
}

export interface IPramsGetUsersDepartment extends IParams {
  facilityId?: number;
}

export interface IResponseGetUsersDepartment {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  user_type: string;
  avatar: string;
  schedules: any;
}
