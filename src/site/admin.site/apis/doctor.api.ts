import axiosWithToken from "@/lib/axios/axios-private";
import type { ResponseParamsResult } from "@/lib/axios/axios-type";
import type { ResponseDoctor } from "../types/doctor";
import type { IParams } from "@/types/params";

const doctorAdmin = {
  getDoctorList: async (
    params?: IParams
  ): Promise<ResponseParamsResult<ResponseDoctor[]>> => {
    return await axiosWithToken.get("/doctor/get-list-doctor", {
      params: {
        ...params,
      },
    });
  },
};

export default doctorAdmin;
