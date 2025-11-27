import { createParamsAtom } from "@/stores/params";
import type { IParams } from "@/types/params";

export interface GetListAppointmentParams extends IParams {
  facility?: number;
  // add other params here
}

export const getDoctorUserParamsAtom =
  createParamsAtom<GetListAppointmentParams>("get_list_appointment_params");
