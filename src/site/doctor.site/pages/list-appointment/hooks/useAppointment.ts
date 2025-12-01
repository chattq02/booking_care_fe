import { useMutation, useQuery } from "@tanstack/react-query";
import { type PaginationResponse } from "@/lib/axios/axios-type";
import type { IMyAppointmentRes } from "@/site/user.site/pages/profile/types/type";
import type { AppointmentParams, AppointmentStatus } from "../stores/params";
import appointmentDoctor from "@/site/doctor.site/api/appointment";
import { useMemo } from "react";
import { stringify } from "qs";

export const useGetAppointment = (param: AppointmentParams) => {
  const key = useMemo(() => stringify(param), [param]);
  return useQuery<PaginationResponse<IMyAppointmentRes[]>>({
    queryKey: ["appointment", key],
    queryFn: async () => {
      const res = await appointmentDoctor.getList(param);
      return res.data;
    },
  });
};

export const useUpadateStatusAppointment = () => {
  return useMutation({
    mutationFn: async (data: { id: number; status: AppointmentStatus }) => {
      const res = await appointmentDoctor.updateStatus(data.id, data.status);
      return res.data;
    },
  });
};
