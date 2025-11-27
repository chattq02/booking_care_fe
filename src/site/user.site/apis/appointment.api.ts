import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";

import axiosPublic from "@/lib/axios/axios-public";
import type { GetListAppointmentParams } from "../pages/doctors/store/params";
import type { IAppointment } from "../pages/doctors/types/appointment";

const appointmentApi = {
  // Lấy danh sách cuộc hẹn, có filter, pagination
  getAppointmentList: async (
    params?: GetListAppointmentParams
  ): Promise<ResponseParamsResult<IAppointment[]>> => {
    return axiosPublic.get("/user/appointment", { params });
  },

  // Lấy chi tiết cuộc hẹn theo ID
  getAppointmentDetail: async (
    id: number
  ): Promise<ResponseResult<IAppointment>> => {
    return axiosPublic.get(`/user/appointment/${id}`);
  },

  // Tạo cuộc hẹn mới
  createAppointment: async (
    data: Partial<IAppointment>
  ): Promise<ResponseResult<IAppointment>> => {
    return axiosPublic.post("/user/appointment", data);
  },

  // Cập nhật cuộc hẹn
  updateAppointment: async (
    id: number,
    data: Partial<IAppointment>
  ): Promise<ResponseResult<IAppointment>> => {
    return axiosPublic.put(`/user/appointment/${id}`, data);
  },

  // Xóa cuộc hẹn
  deleteAppointment: async (id: number): Promise<ResponseResult<null>> => {
    return axiosPublic.delete(`/user/appointment/${id}`);
  },

  // Lấy danh sách cuộc hẹn của bác sĩ
  getAppointmentsByDoctor: async (
    doctorId: number
  ): Promise<ResponseParamsResult<IAppointment[]>> => {
    return axiosPublic.get(`/user/appointment/doctor/${doctorId}`);
  },

  // Lấy danh sách cuộc hẹn của bệnh nhân
  getAppointmentsByPatient: async (
    patientId: number
  ): Promise<ResponseParamsResult<IAppointment[]>> => {
    return axiosPublic.get(`/user/appointment/patient/${patientId}`);
  },
};

export default appointmentApi;
