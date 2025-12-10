import { useMutation, useQuery } from "@tanstack/react-query";
import { type PaginationResponse } from "@/lib/axios/axios-type";
import type { IMyAppointmentRes } from "@/site/user.site/pages/profile/types/type";
import type {
  AppointmentCompletedPaidParams,
  AppointmentCurrentNextPatientParams,
  AppointmentParamsDasboard,
  AppointmentReportParams,
  AppointmentStatus,
} from "../stores/params";
import appointmentDoctor from "@/site/doctor.site/api/appointment";
import type { MedicalAppointmentData } from "../type";

export const useGetAppointment = (
  param: AppointmentParamsDasboard,
  enabled = true
) => {
  return useQuery<PaginationResponse<IMyAppointmentRes[]>>({
    queryKey: ["list-appointment", param],
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

export const useGetCurrentAndNextPatient = (
  param: AppointmentCurrentNextPatientParams,
  enabled = true
) => {
  return useQuery({
    queryKey: ["current-next-patient", param],
    queryFn: async () => {
      const res = await appointmentDoctor.getCurrentAndNext(param);
      return res.data;
    },
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useGetCompletedAndPaidAppointments = (
  param: AppointmentCompletedPaidParams,
  enabled = true
) => {
  return useQuery({
    queryKey: ["completed-paid-appointments", param],
    queryFn: async () => {
      const res = await appointmentDoctor.getCompletedAndPaid(param);
      return res.data; // format giống hook cũ
    },
    enabled,
    placeholderData: (prev) => prev,
  });
};

export const useGetDetailPatient = (id: number, isAppointmentId: boolean) => {
  return useQuery({
    queryKey: ["get-detail-patient", id],
    queryFn: async () => {
      const res = await appointmentDoctor.getPatientDetail(id, isAppointmentId);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useGetDetailPatientHistory = (id: number) => {
  return useQuery({
    queryKey: ["get-history-appointment", id],
    queryFn: async () => {
      const res = await appointmentDoctor.getAppointmentHistory(id);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useSaveMedicalRecord = () => {
  return useMutation({
    mutationFn: async (data: MedicalAppointmentData) => {
      const res = await appointmentDoctor.saveMedicalRecord(data);
      return res.data;
    },
  });
};
