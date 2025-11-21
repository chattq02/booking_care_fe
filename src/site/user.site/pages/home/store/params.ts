import { createParamsAtom } from "@/stores/params";
import type { IParams } from "@/types/params";

export interface GetDoctorUserParams extends IParams {
  facility?: number;
  // add other params here
}

export const getDoctorUserParamsAtom = createParamsAtom<GetDoctorUserParams>(
  "get_doctor_user_params"
);
