// hooks/useFacility.ts
import medicalFacilityAdmin from "@/site/admin.site/apis/medical-facility";
import departmentAdmin from "@/site/admin.site/apis/specialty";
import type { IPramsGetUsersDepartment } from "@/site/admin.site/pages/specialty/type";
import facilityUser from "@/site/user.site/apis/facility.api";
import type { IParams } from "@/types/params";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { stringify } from "qs";
import { useMemo } from "react";

export const useGetListFacility = (params: IParams, enabled = true) => {
  const key = useMemo(() => stringify(params), [params]);

  const queryResult = useInfiniteQuery({
    queryKey: ["listFacility", key],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await facilityUser.getFacilityList({
        ...params,
        page: pageParam,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Kiểm tra dựa trên số lượng items trả về
      const itemsPerPage = params.per_page || 30;
      if (lastPage.data?.length >= itemsPerPage) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled,
  });

  // Tính toán allFacilities từ trong hook
  const allFacilities = useMemo(
    () => queryResult.data?.pages.flatMap((page) => page.data) || [],
    [queryResult.data?.pages]
  );

  // Trả về kết quả kèm allFacilities
  return {
    ...queryResult,
    data: allFacilities,
  };
};

export const useGetFacility = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["facility", id],
    queryFn: async () => {
      const res = await medicalFacilityAdmin.getDetailFacility(id);
      return res.data;
    },
    enabled: enabled,
  });
};

export const useGetUsersDepartmentInfinite = (
  id: number | undefined,
  params: IPramsGetUsersDepartment,
  enabled = true
) => {
  const key = useMemo(() => stringify(params), [params]);

  const queryResult = useInfiniteQuery({
    queryKey: ["getUsersDepartment", id, key],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await departmentAdmin.getUsersDepartment(id, {
        ...params,
        page: pageParam,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const itemsPerPage = params.per_page || 30;

      // Chỉ load thêm nếu số item >= per_page
      if (lastPage.data?.length >= itemsPerPage) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: Boolean(id) && enabled,
  });

  // Flatten toàn bộ kết quả
  const allUsersDepartment = useMemo(
    () => queryResult.data?.pages.flatMap((page) => page.data) || [],
    [queryResult.data?.pages]
  );

  return {
    ...queryResult,
    data: allUsersDepartment,
  };
};
