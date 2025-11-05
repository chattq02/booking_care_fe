export interface ResponseDepartment {
  id?: number; // Mã phòng ban
  name: string; // Tên phòng ban
  description?: string | null; // Mô tả
  parentId?: number | null; // ID phòng ban cha

  parent?: ResponseDepartment | null; // Đối tượng cha
  children?: ResponseDepartment[]; // Danh sách phòng ban con

  createdAt?: Date; // Ngày tạo
  updatedAt?: Date; // Ngày cập nhật
}
