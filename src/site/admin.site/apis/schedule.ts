import axiosWithToken from "@/lib/axios/axios-private";
import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";
import type {
  IWorkSchedule,
  ResponseMedicalFacility,
  ResponseSchedule,
  ScheduleDateByDoctor,
  ScheduleParams,
} from "../pages/medical-facility/type";
import type { MedicalFacilityParams } from "../pages/medical-facility/store/params";
import type { ResponseDoctor } from "../types/doctor";

const scheduleAdmin = {
  /**
   * 🏥 Lấy danh sách lịch hẹn
   */
  getList: async (
    params?: ScheduleParams
  ): Promise<ResponseParamsResult<ResponseSchedule[]>> => {
    return await axiosWithToken.get("/schedule/get-list", {
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
  create: (data: IWorkSchedule) => {
    return axiosWithToken.post("/schedule/create", data);
  },

  /**
   * 🛠️ Cập nhật thông tin lịch
   */
  update: (id: number, data: IWorkSchedule) => {
    return axiosWithToken.put(`/schedule/${id}`, data);
  },

  /**
   * 🗑️ Xóa cơ sở y tế
   */
  delete: (id: number) => {
    return axiosWithToken.delete(`/admin/medical-facility/${id}`);
  },
  /**
   * 🗑️ Xóa cơ sở y tế
   */
  getScheduleByDay: (params: ScheduleDateByDoctor) => {
    return axiosWithToken.get(`schedule/get-schedule-doctor-day`, {
      params: {
        ...params,
      },
    });
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
};

export default scheduleAdmin;
