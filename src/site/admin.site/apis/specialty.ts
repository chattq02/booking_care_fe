import axiosWithToken from "@/lib/axios/axios-private";
import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";
import type { IParams } from "@/types/params";
import type { ResponseDepartment } from "../pages/specialty/type";

const departmentAdmin = {
  /**
   * 🧩 Lấy danh sách phòng ban (có phân trang, tìm kiếm)
   */
  getList: async (
    params?: IParams
  ): Promise<ResponseParamsResult<ResponseDepartment[]>> => {
    const result = await axiosWithToken.get("/admin/department", {
      params: {
        ...params,
      },
    });
    return result.data;
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
   * 🗑️ Xóa phòng ban
   */
  delete: (id: number, facilityId: number) => {
    return axiosWithToken.delete(`/admin/department/${id}/${facilityId}`);
  },
};

export default departmentAdmin;
