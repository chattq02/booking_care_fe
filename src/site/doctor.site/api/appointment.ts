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
  AppointmentCompletedPaidParams,
  AppointmentCurrentNextPatientParams,
  AppointmentParamsDasboard,
  AppointmentReportParams,
  AppointmentStatus,
  AppointmentUserFindParams,
} from "../pages/list-appointment/stores/params";
import type { ICurrentNextAppointmentRes } from "../pages/home/types";
import type {
  IAppointmentHistoryItem,
  IAppointmentHistoryRes,
  ICompletedPaidAppointmentRes,
  IPatientDetailAppointmentRes,
  MedicalAppointmentData,
} from "../pages/list-appointment/type";

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

  updateStatusUser: (
    id: number,
    status: AppointmentStatus,
    remark?: string
  ): Promise<ResponseParamsResult<IMyAppointmentRes>> => {
    return axiosWithToken.put(`/user/appointment/${id}`, {
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

  getCompletedAndPaid: (
    params?: AppointmentCompletedPaidParams
  ): Promise<ResponseParamsResult<ICompletedPaidAppointmentRes[]>> => {
    return axiosWithToken.get("/user/appointment-completed-paid", {
      params: {
        ...params,
      },
    });
  },

  getPatientDetail: (
    id: number,
    isAppointmentId: boolean = false
  ): Promise<ResponseResult<IPatientDetailAppointmentRes>> => {
    return isAppointmentId
      ? axiosWithToken.get(
          `/user/appointment-patient-detail-by-appointmentId/${id}`
        )
      : axiosWithToken.get(`/user/appointment-patient-detail-history/${id}`);
  },

  getAppointmentHistory: (
    id: number
  ): Promise<ResponseResult<IAppointmentHistoryRes>> => {
    return axiosWithToken.get(`/user/appointment-patient-detail-history/${id}`);
  },

  // 🔥 API Lưu thông tin khám bệnh + đơn thuốc
  saveMedicalRecord: (data: MedicalAppointmentData) => {
    return axiosWithToken.post("/user/appointment-medical-record", data);
  },

  appointmentFindStatus: (
    params?: AppointmentUserFindParams
  ): Promise<ResponseParamsResult<IAppointmentHistoryItem[]>> => {
    return axiosWithToken.get("/user/appointment-find-status", {
      params: {
        ...params,
      },
    });
  },
};

export default appointmentDoctor;
