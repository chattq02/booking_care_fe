import authApi from "@/apis/auth.api";
import type { ReqUpdateUser } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IMyAppointmentRes, IParamMyAppointment } from "../types/type";
import type { PaginationResponse } from "@/lib/axios/axios-type";

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

// lấy thông tin lịcg hẹn của user
export const useGetMyAppointment = (params: IParamMyAppointment) => {
  return useQuery<PaginationResponse<IMyAppointmentRes[]>>({
    queryKey: ["getMyAppointment", params],
    queryFn: () => authApi.getMyAppointment(params),
    refetchOnWindowFocus: false,
  });
};
