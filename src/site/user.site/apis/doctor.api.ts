import axiosWithToken from "@/lib/axios/axios-private";
import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";
import type { ResponseDoctor } from "@/site/admin.site/types/doctor";
import type { GetDoctorUserParams } from "../pages/home/store/params";
import type { ISchedule } from "../types/schedule";

const doctorUser = {
  getDoctorList: async (
    params?: GetDoctorUserParams
  ): Promise<ResponseParamsResult<ResponseDoctor[]>> => {
    return await axiosWithToken.get("/user/get-list-doctor", {
      params: {
        ...params,
      },
    });
  },

  getDoctorDetail: async (
    id: number
  ): Promise<ResponseResult<ResponseDoctor>> => {
    return axiosWithToken.get(`/user/get-doctor/${id}`);
  },

  getDoctorSchedule: async (params: {
    doctorId: number;
    date: string;
  }): Promise<ResponseResult<ISchedule[]>> => {
    return axiosWithToken.get(
      `/user/get-schedule-doctor-day?doctorId=${params.doctorId}&date=${params.date}`
    );
  },
};

export default doctorUser;
