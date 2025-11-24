import axiosPublic from "@/lib/axios/axios-public";
import type { ResponseParamsResult } from "@/lib/axios/axios-type";

import type { IParams } from "@/types/params";
import type { ResponseMedicalFacility } from "../types/facility";

const facilityUser = {
  getFacilityList: async (
    params?: IParams
  ): Promise<ResponseParamsResult<ResponseMedicalFacility[]>> => {
    return await axiosPublic.get("/user/medical-facility", {
      params: {
        ...params,
      },
    });
  },
};

export default facilityUser;
