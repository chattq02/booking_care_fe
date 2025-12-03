import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/stores/loading";

import type { IParams } from "@/types/params";
import medicalFacilityAdmin from "@/site/admin.site/apis/medical-facility";
import type { ResponseMedicalFacility } from "../type";
import type { MedicalFacilityParams } from "../store/params";
import { useMemo } from "react";
import { stringify } from "qs";

interface UseCreateMedicalFacilityOptions {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
}

// 🔹 Lấy danh sách cơ sở y tế (có phân trang, tìm kiếm)
export const useGetListMedicalFacility = (params: IParams, enabled = true) => {
  const key = useMemo(() => stringify(params), [params]);
  return useQuery({
    queryKey: ["medicalFacilities", key],
    queryFn: async () => {
      const result = await medicalFacilityAdmin.getList(params);
      return result.data;
    },
    enabled,
    placeholderData: (prev) => prev,
  });
};

// 🔹 Lấy danh sách cơ sở y tế (có phân trang, tìm kiếm)
export const useGetListDoctorMedicalFacility = (
  params: MedicalFacilityParams,
  enabled = true
) => {
  return useQuery({
    queryKey: ["ListDoctorMedicalFacility", params],
    queryFn: async () => {
      const result = await medicalFacilityAdmin.getListDoctors(params);
      return result.data;
    },
    enabled,
    placeholderData: (prev) => prev,
  });
};

// 🔹 Lấy chi tiết cơ sở y tế
export const useGetMedicalFacilityDetail = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["GetMedicalFacilityDetail", id],
    queryFn: async () => {
      const result = await medicalFacilityAdmin.getDetailFacility(id);
      return result.data;
    },
    enabled,
    placeholderData: (prev) => prev,
  });
};

// 🔹 Lấy cây cơ sở y tế (theo cha – con, nếu có)
export const useGetTreeMedicalFacility = () => {
  return useQuery({
    queryKey: ["medicalFacility-tree"],
    queryFn: () => medicalFacilityAdmin.getTree(),
  });
};

// 🔹 Tạo mới cơ sở y tế
export const useCreateMedicalFacility = ({
  onSuccessCallback,
  onErrorCallback,
}: UseCreateMedicalFacilityOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ResponseMedicalFacility) => {
      const response = await medicalFacilityAdmin.create(data);
      return response.data;
    },

    onSuccess: () => {
      toast.success("Tạo cơ sở y tế thành công");
      queryClient.invalidateQueries({ queryKey: ["medicalFacilities"] });
      queryClient.invalidateQueries({ queryKey: ["medicalFacility-tree"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      onErrorCallback?.();
      toast.error(error.response?.data?.message || "Không tạo được cơ sở y tế");
    },
  });
};

// 🔹 Cập nhật cơ sở y tế
export const useUpdateMedicalFacility = ({
  onSuccessCallback,
  onErrorCallback,
}: UseCreateMedicalFacilityOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ResponseMedicalFacility) =>
      medicalFacilityAdmin.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMedicalFacilityDetail"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      onErrorCallback?.();
      toast.error(
        error.response?.data?.message || "Không cập nhật được cơ sở y tế"
      );
    },
  });
};

// 🔹 Xóa cơ sở y tế
export const useDeleteMedicalFacility = () => {
  const queryClient = useQueryClient();
  const setLoading = useSetAtom(loadingAtom);

  return useMutation({
    mutationFn: (id: number) => medicalFacilityAdmin.delete(id),
    onSuccess: () => {
      toast.success("Xóa cơ sở y tế thành công");
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["medicalFacilities"] });
      queryClient.invalidateQueries({ queryKey: ["medicalFacility-tree"] });
    },
    onError: (error: any) => {
      setLoading(false);
      toast.error(error.response?.data?.message || "Không xóa được cơ sở y tế");
    },
  });
};
