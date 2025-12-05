import axiosWithToken from "@/lib/axios/axios-private";
import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";

import type {
  IPramsGetUsersDepartment,
  IResponseGetUsersDepartment,
  ResponseDepartment,
} from "../pages/specialty/type";

const departmentAdmin = {
  /**
   * 🧩 Lấy danh sách phòng ban (có phân trang, tìm kiếm)
   */
  getList: async (
    params?: IPramsGetUsersDepartment
  ): Promise<ResponseParamsResult<ResponseDepartment[]>> => {
    return axiosWithToken.get("/admin/department", {
      params: {
        ...params,
      },
    });
  },

  /**
   * 🌳 Lấy cây phòng ban (theo cấp cha – con)
   */
  getTree: async (
    facilityId: number
  ): Promise<ResponseResult<ResponseDepartment[]>> => {
    return axiosWithToken.get("/admin/department/tree", {
      params: {
        facilityId,
      },
    });
  },

  /**
   * ➕ Tạo phòng ban mới
   */
  create: (data: ResponseDepartment) => {
    return axiosWithToken.post("/admin/department", data);
  },

  /**
   * 🛠️ Cập nhật phòng ban
   */
  update: (data: ResponseDepartment) => {
    return axiosWithToken.put(`/admin/department/${data.id}`, data);
  },

  /**
   * Lấy thông tin người dùng trong phòng ban
   */
  getUsersDepartment: (
    id: number | undefined,
    params: IPramsGetUsersDepartment
  ): Promise<ResponseParamsResult<IResponseGetUsersDepartment[]>> => {
    return axiosWithToken.get(`/admin/department/${id}/users`, {
      params: params,
    });
  },

  /**
   * 🗑️ Xóa phòng ban
   */
  delete: (id: number, facilityId: number) => {
    return axiosWithToken.delete(`/admin/department/${id}/${facilityId}`);
  },
};

export default departmentAdmin;
