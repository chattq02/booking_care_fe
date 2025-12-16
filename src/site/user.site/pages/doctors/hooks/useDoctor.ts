import doctorUser from "@/site/user.site/apis/doctor.api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { stringify } from "qs";
import { useMemo } from "react";
import type { GetDoctorUserParams } from "../../home/store/params";

export const useGetListDoctor = (
  params: GetDoctorUserParams, // Loại bỏ page từ params
  enabled = true
) => {
  const key = useMemo(() => stringify(params), [params]);

  const queryResult = useInfiniteQuery({
    queryKey: ["listdoctor", key],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await doctorUser.getDoctorList({
        ...params,
        page: pageParam, // Thêm pageParam vào request
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Kiểm tra dựa trên số lượng items trả về
      const itemsPerPage = params.per_page || 30;
      if (lastPage.data?.length >= itemsPerPage) {
        return allPages.length + 1;
      }
      return undefined; // Không còn page nào
    },
    initialPageParam: 1,
    enabled: enabled,
  });

  // Tính toán allDoctors từ trong hook
  const allDoctors = useMemo(
    () => queryResult.data?.pages.flatMap((page) => page.data) || [],
    [queryResult.data?.pages]
  );

  // Trả về kết quả kèm allDoctors
  return {
    ...queryResult,
    data: allDoctors,
  };
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
    departmentId: number;
  },
  enabled = true
) => {
  // const key = useMemo(() => stringify(params), [params]);
  return useQuery({
    queryKey: ["detailDoctor", params],
    queryFn: async () => {
      const res = await doctorUser.getDoctorSchedule(params);
      return res.data;
    },
    enabled: enabled,
  });
};
