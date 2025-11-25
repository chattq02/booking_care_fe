import authApi from "@/apis/auth.api";
import type { ReqUpdateUser } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseCreateUserOptions {
  onSuccessCallback?: () => void; // callback khi thành công
  onErrorCallback?: () => void; // callback khi thất bại
}
// 🔹 Cập nhật thông tin
export const useUpdateUser = ({
  onSuccessCallback,
  onErrorCallback,
}: UseCreateUserOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReqUpdateUser) => authApi.updateUser(data),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.refetchQueries({ queryKey: ["me"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      if (onErrorCallback) {
        onErrorCallback();
      }
      toast.error(
        error.response?.data.message || "Không cập nhật được thông tin"
      );
    },
  });
};
