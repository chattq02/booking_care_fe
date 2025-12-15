import type {
  ResponseParamsResult,
  ResponseResult,
} from "@/lib/axios/axios-type";
import type { ResponseDoctor } from "@/site/admin.site/types/doctor";
import type { GetDoctorUserParams } from "../pages/home/store/params";
import type { ISchedule } from "../types/schedule";
import axiosPublic from "@/lib/axios/axios-public";

const doctorUser = {
  getDoctorList: async (
    params?: GetDoctorUserParams
  ): Promise<ResponseParamsResult<ResponseDoctor[]>> => {
    return await axiosPublic.get("/user/get-list-doctor", {
      params: {
        ...params,
      },
    });
  },

  getDoctorDetail: async (
    id: number
  ): Promise<ResponseResult<ResponseDoctor>> => {
    return axiosPublic.get(`/user/get-doctor/${id}`);
  },

  getDoctorSchedule: async (params: {
    doctorId: number;
    date: string;
  }): Promise<ResponseResult<ISchedule[]>> => {
    return axiosPublic.get(
      `/user/get-schedule-doctor-day?doctorId=${params.doctorId}&date=${params.date}`
    );
  },

  getDoctorAndFacilitiesSearch: async (
    keyword: string
  ): Promise<ResponseResult<ISchedule[]>> => {
    return axiosPublic.get(`/doctor/search-users-facilities`, {
      params: keyword,
    });
  },
};

export default doctorUser;
