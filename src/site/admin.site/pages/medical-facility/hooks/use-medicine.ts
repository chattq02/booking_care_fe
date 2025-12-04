import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import medicineApi from "@/site/admin.site/apis/medicine";
import type { ICreateMedicineDto, IUpdateMedicineDto } from "../type";
import type { IParams } from "@/types/params";
import { toast } from "sonner";

interface UseOptions {
  onSuccessCallback?: () => void;
  onErrorCallback?: () => void;
}

/* ----------------------------------------------------
 * 🔹 Lấy danh sách thuốc
 * -------------------------------------------------- */
export const useGetListMedicine = (params: IParams, enabled = true) => {
  return useQuery({
    queryKey: ["ListMedicine", params],
    queryFn: async () => {
      const result = await medicineApi.getList(params);
      return result.data;
    },
    enabled,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });
};

/* ----------------------------------------------------
 * 🔍 Lấy chi tiết 1 thuốc
 * -------------------------------------------------- */
export const useGetMedicineDetail = (id?: number, enabled = true) => {
  return useQuery({
    queryKey: ["MedicineDetail", id],
    queryFn: async () => {
      if (!id) return null;
      const result = await medicineApi.getById(id);
      return result.data;
    },
    enabled: Boolean(id) && enabled,
    staleTime: 1000 * 60 * 5,
  });
};

/* ----------------------------------------------------
 * ➕ Tạo thuốc mới
 * -------------------------------------------------- */
export const useCreateMedicine = ({
  onSuccessCallback,
  onErrorCallback,
}: UseOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateMedicineDto) => medicineApi.create(data),

    onSuccess: () => {
      toast.success("Thêm thuốc thành công");
      queryClient.invalidateQueries({ queryKey: ["ListMedicine"] });
      onSuccessCallback?.();
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Lỗi tạo thuốc");
      onErrorCallback?.();
    },
  });
};

/* ----------------------------------------------------
 * 🛠️ Cập nhật thuốc
 * -------------------------------------------------- */
export const useUpdateMedicine = ({
  onSuccessCallback,
  onErrorCallback,
}: UseOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateMedicineDto) => medicineApi.update(data),

    onSuccess: () => {
      toast.success("Cập nhật thuốc thành công");
      queryClient.invalidateQueries({ queryKey: ["ListMedicine"] });
      queryClient.invalidateQueries({ queryKey: ["MedicineDetail"] });
      onSuccessCallback?.();
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Lỗi cập nhật thuốc");
      onErrorCallback?.();
    },
  });
};

/* ----------------------------------------------------
 * 🗑️ Xóa thuốc
 * -------------------------------------------------- */
export const useDeleteMedicine = ({
  onSuccessCallback,
  onErrorCallback,
}: UseOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => medicineApi.delete(id),

    onSuccess: () => {
      toast.success("Xóa thuốc thành công");
      queryClient.invalidateQueries({ queryKey: ["ListMedicine"] });
      onSuccessCallback?.();
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Lỗi xóa thuốc");
      onErrorCallback?.();
    },
  });
};
