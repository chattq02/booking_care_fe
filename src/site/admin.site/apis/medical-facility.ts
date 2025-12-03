// 📁 src/api/admin/medical-facility.api.ts

import axiosWithToken from "@/lib/axios/axios-private";
import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";
import type { IParams } from "@/types/params";
import type { ResponseMedicalFacility } from "../pages/medical-facility/type";
import type { MedicalFacilityParams } from "../pages/medical-facility/store/params";
import type { ResponseDoctor } from "../types/doctor";

const medicalFacilityAdmin = {
  /**
   * 🏥 Lấy danh sách cơ sở y tế (có phân trang, tìm kiếm)
   */
  getList: async (
    params?: IParams
  ): Promise<ResponseParamsResult<ResponseMedicalFacility[]>> => {
    return await axiosWithToken.get("/admin/medical-facility", {
      params: {
        ...params,
      },
    });
  },

  /**
   * 🏙️ Lấy danh sách cơ sở y tế dạng cây (nếu có phân cấp, ví dụ chi nhánh)
   */
  getTree: async (): Promise<ResponseResult<ResponseMedicalFacility[]>> => {
    return axiosWithToken.get("/admin/medical-facility/tree");
  },

  /**
   * ➕ Tạo mới cơ sở y tế
   */
  create: (
    data: ResponseMedicalFacility
  ): Promise<ResponseResult<ResponseMedicalFacility>> => {
    return axiosWithToken.post("/admin/medical-facility", data);
  },

  /**
   * 🛠️ Cập nhật thông tin cơ sở y tế
   */
  update: (data: ResponseMedicalFacility) => {
    return axiosWithToken.put(`/admin/medical-facility/${data.id}`, data);
  },

  /**
   * 🗑️ Xóa cơ sở y tế
   */
  delete: (id: number) => {
    return axiosWithToken.delete(`/admin/medical-facility/${id}`);
  },

  /**
   * lấy thông tin bác sĩ
   */

  getListDoctors: async (
    params?: MedicalFacilityParams
  ): Promise<ResponseParamsResult<ResponseDoctor[]>> => {
    return await axiosWithToken.get(
      `/admin/medical-facility/${params?.id}/users`,
      {
        params: {
          ...params,
        },
      }
    );
  },

  getDetailFacility: async (
    id: number
  ): Promise<ResponseResult<ResponseMedicalFacility>> => {
    return axiosWithToken.get(`/admin/medical-facility/${id}`);
  },
};

export default medicalFacilityAdmin;
