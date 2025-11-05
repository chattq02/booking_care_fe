import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { IParams } from "@/types/params";
import type { ResponseDepartment } from "../type";
import { toast } from "sonner";
import departmentAdmin from "@/site/admin.site/apis/specialty";
import { loadingAtom } from "@/stores/loading";
import { useSetAtom } from "jotai";

interface UseCreateDepartmentOptions {
  onSuccessCallback?: () => void; // callback khi thành công
  onErrorCallback?: () => void; // callback khi thất bại
}

// 🔹 Lấy danh sách khoa
export const useGetListDepartment = (params: IParams, enabled = true) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => departmentAdmin.getList(params),
    enabled: enabled,
  });
};

// 🔹 Lấy cây khoa (tree)
export const useGetTreeDepartment = () => {
  return useQuery({
    queryKey: ["department-tree"],
    queryFn: () => departmentAdmin.getTree(),
  });
};

// 🔹 Tạo mới khoa
export const useCreateDepartment = ({
  onSuccessCallback,
  onErrorCallback,
}: UseCreateDepartmentOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResponseDepartment) => departmentAdmin.create(data),
    onSuccess: () => {
      toast.success("Tạo khoa thành công");

      // refresh các query liên quan
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department-tree"] });

      // callback để đóng popup hoặc làm việc khác
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      if (onErrorCallback) {
        onErrorCallback();
      }
      toast.error(error.response?.data?.message || "Không tạo được khoa");
    },
  });
};

// 🔹 Cập nhật khoa
export const useUpdateDepartment = ({
  onSuccessCallback,
  onErrorCallback,
}: UseCreateDepartmentOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ResponseDepartment) => departmentAdmin.update(data),
    onSuccess: () => {
      toast.success("Cập nhật khoa thành công");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department-tree"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      if (onErrorCallback) {
        onErrorCallback();
      }
      toast.error(error.response?.data.message || "Không cập nhật được khoa");
    },
  });
};

// 🔹 Xóa khoa
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  const setLoading = useSetAtom(loadingAtom);

  return useMutation({
    mutationFn: (id: number) => departmentAdmin.delete(id),
    onSuccess: () => {
      toast.success("Xóa khoa thành công");
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["department-tree"] });
    },
    onError: (error: any) => {
      setLoading(false);
      toast.error(error.response?.data.message || "Không xóa được khoa");
    },
  });
};
