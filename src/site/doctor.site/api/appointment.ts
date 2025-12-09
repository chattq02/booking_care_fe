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
  AppointmentCurrentNextPatientParams,
  AppointmentParamsDasboard,
  AppointmentReportParams,
  AppointmentStatus,
} from "../pages/list-appointment/stores/params";
import type { ICurrentNextAppointmentRes } from "../pages/home/types";

const appointmentDoctor = {
  getList: (
    params?: AppointmentParamsDasboard
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

  getCurrentAndNext: (
    params: AppointmentCurrentNextPatientParams
  ): Promise<ResponseResult<ICurrentNextAppointmentRes>> => {
    return axiosWithToken.get("/user/appointment-current-next", { params });
  },
};

export default appointmentDoctor;
