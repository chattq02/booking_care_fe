import axiosWithToken from "@/lib/axios/axios-private";
import type { ResponseParamsResult } from "@/lib/axios/axios-type";
import type { IMyAppointmentRes } from "@/site/user.site/pages/profile/types/type";
import type {
  AppointmentParams,
  AppointmentStatus,
} from "../pages/list-appointment/stores/params";

const appointmentDoctor = {
  getList: (
    params?: AppointmentParams
  ): Promise<ResponseParamsResult<IMyAppointmentRes[]>> => {
    return axiosWithToken.get("/user/appointment-doctor", {
      params: {
        ...params,
      },
    });
  },

  updateStatus: (
    id: number,
    status: AppointmentStatus,
    remark?: string
  ): Promise<ResponseParamsResult<IMyAppointmentRes>> => {
    return axiosWithToken.put(`/user/appointment/${id}/status`, {
      status,
      remark,
    });
  },
};

export default appointmentDoctor;
