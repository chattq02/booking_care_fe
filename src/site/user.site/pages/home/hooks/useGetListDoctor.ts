import doctorUser from "@/site/user.site/apis/doctor.api";
import { useQuery } from "@tanstack/react-query";
import { stringify } from "qs";
import { useMemo } from "react";
import type { GetDoctorUserParams } from "../store/params";

export const useGetListDoctor = (
  params: GetDoctorUserParams,
  enabled = true
) => {
  const key = useMemo(() => stringify(params), [params]);
  return useQuery({
    queryKey: ["listdoctor", key],
    queryFn: async () => {
      const res = await doctorUser.getDoctorList(params);
      return res.data;
    },
    enabled: enabled,
  });
};

export const useGetDetailDoctor = (id: number, enabled = true) => {
  const key = useMemo(() => stringify(id), [id]);
  return useQuery({
    queryKey: ["detailDoctor", key],
    queryFn: async () => {
      const res = await doctorUser.getDoctorDetail(id);
      return res.data;
    },
    enabled: enabled,
  });
};

export const useGetScheduleDoctor = (
  params: {
    doctorId: number;
    date: string;
  },
  enabled = true
) => {
  const key = useMemo(() => stringify(params), [params]);
  return useQuery({
    queryKey: ["detailDoctor", key],
    queryFn: async () => {
      const res = await doctorUser.getDoctorSchedule(params);
      return res.data;
    },
    enabled: enabled,
  });
};
