import { useMutation, useQuery } from "@tanstack/react-query";
import { type PaginationResponse } from "@/lib/axios/axios-type";
import type { IMyAppointmentRes } from "@/site/user.site/pages/profile/types/type";
import type {
  AppointmentParams,
  AppointmentReportParams,
  AppointmentStatus,
} from "../stores/params";
import appointmentDoctor from "@/site/doctor.site/api/appointment";
import { useMemo } from "react";
import { stringify } from "qs";

export const useGetAppointment = (param: AppointmentParams, enabled = true) => {
  const key = useMemo(() => stringify(param), [param]);
  return useQuery<PaginationResponse<IMyAppointmentRes[]>>({
    queryKey: ["list-appointment", key],
    queryFn: async () => {
      const res = await appointmentDoctor.getList(param);
      return res.data;
    },
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useUpadateStatusAppointment = () => {
  return useMutation({
    mutationFn: async (data: {
      id: number;
      status: AppointmentStatus;
      remark?: string;
    }) => {
      const res = await appointmentDoctor.updateStatus(
        data.id,
        data.status,
        data.remark
      );
      return res.data;
    },
  });
};

export const useAppointmentReport = (param: AppointmentReportParams) => {
  return useQuery({
    queryKey: ["appointment-report", param],
    queryFn: async () => {
      const res = await appointmentDoctor.report(param);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
};
