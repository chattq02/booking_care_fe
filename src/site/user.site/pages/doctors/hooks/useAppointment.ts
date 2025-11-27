import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { stringify } from "qs";
import { useMemo } from "react";
import appointmentApi from "@/site/user.site/apis/appointment.api";
import type { IAppointment, ICreateAppointment } from "../types/appointment";
import type { GetListAppointmentParams } from "../store/params";
import { toast } from "sonner";

// ---------------------- LIST & DETAIL ----------------------
export const useGetListAppointment = (
  params: GetListAppointmentParams,
  enabled = true
) => {
  const key = useMemo(() => stringify(params), [params]);
  const queryResult = useInfiniteQuery({
    queryKey: ["listAppointment", key],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await appointmentApi.getAppointmentList({
        ...params,
        page: pageParam,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const itemsPerPage = params.per_page || 10;
      if (lastPage.data?.length >= itemsPerPage) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  const allAppointments = useMemo(
    () => queryResult.data?.pages.flatMap((page) => page.data) || [],
    [queryResult.data?.pages]
  );

  return { ...queryResult, data: allAppointments };
};

export const useGetAppointmentDetail = (id: number, enabled = true) => {
  const key = useMemo(() => stringify(id), [id]);
  return useQuery({
    queryKey: ["detailAppointment", key],
    queryFn: async () => {
      const res = await appointmentApi.getAppointmentDetail(id);
      return res.data;
    },
    enabled,
  });
};

// ---------------------- CRUD MUTATIONS ----------------------
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<ICreateAppointment>) => {
      const res = await appointmentApi.createAppointment(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listAppointment"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Đăng ký khám thất bại");
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<IAppointment>;
    }) => {
      const res = await appointmentApi.updateAppointment(id, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listAppointment"] });
      queryClient.invalidateQueries({
        queryKey: ["detailAppointment", variables.id],
      });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await appointmentApi.deleteAppointment(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listAppointment"] });
    },
  });
};

// ---------------------- LIST THEO DOCTOR & PATIENT ----------------------
export const useGetAppointmentsByDoctor = (
  doctorId: number,
  enabled = true
) => {
  const key = useMemo(() => stringify(doctorId), [doctorId]);
  return useQuery({
    queryKey: ["appointmentsByDoctor", key],
    queryFn: async () => {
      const res = await appointmentApi.getAppointmentsByDoctor(doctorId);
      return res.data;
    },
    enabled,
  });
};

export const useGetAppointmentsByPatient = (
  patientId: number,
  enabled = true
) => {
  const key = useMemo(() => stringify(patientId), [patientId]);
  return useQuery({
    queryKey: ["appointmentsByPatient", key],
    queryFn: async () => {
      const res = await appointmentApi.getAppointmentsByPatient(patientId);
      return res.data;
    },
    enabled,
  });
};
