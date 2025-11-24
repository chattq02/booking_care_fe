// hooks/useFacility.ts
import facilityUser from "@/site/user.site/apis/facility.api";
import type { IParams } from "@/types/params";
import { useInfiniteQuery } from "@tanstack/react-query";
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
