import axiosWithToken from "@/lib/axios/axios-private";
import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";
import type {
  IMyAppointmentRes,
  ReportAppointment,
} from "@/site/user.site/pages/profile/types/type";
import type {
  AppointmentParams,
  AppointmentReportParams,
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

  report: (
    params: AppointmentReportParams
  ): Promise<ResponseResult<ReportAppointment>> => {
    return axiosWithToken.get(`/user/appointment-report`, {
      params: {
        ...params,
      },
    });
  },
};

export default appointmentDoctor;
